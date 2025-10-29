// backend/controllers/adminController.js
const db = require('../config/db');
const { S3Client, DeleteObjectCommand } = require('@aws-sdk/client-s3');

// --- S3 Client (for delete) ---
const s3 = new S3Client({
    region: process.env.AWS_REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
    }
});

// --- Helper Function: Get or Create Subject ---
const getOrCreateSubject = async (name, branch_id, year, semester) => {
  const connection = await db.getConnection();
  try {
    // 1. Check if subject already exists
    let [subjects] = await connection.query(
      "SELECT subject_id FROM subjects WHERE subject_name = ? AND branch_id = ? AND year = ? AND semester = ?",
      [name, branch_id, year, semester]
    );

    if (subjects.length > 0) {
      // 2. If it exists, return its ID
      return subjects[0].subject_id;
    } else {
      // 3. If not, create it
      const [result] = await connection.query(
        "INSERT INTO subjects (subject_name, branch_id, year, semester) VALUES (?, ?, ?, ?)",
        [name, branch_id, year, semester]
      );
      // 4. Return the new ID
      return result.insertId;
    }
  } finally {
    connection.release();
  }
};


// --- Upload Controller ---
const uploadPaper = async (req, res) => {
    const connection = await db.getConnection();
    try {
        // 1. Get data from form
        const { branch_id, semester, year, subject_name, exam_year } = req.body;
        
        if (!req.file) {
            return res.status(400).send('No file was uploaded.');
        }
        if (!branch_id || !semester || !year || !subject_name) {
            return res.status(400).send('Missing required form fields.');
        }

        // 2. Get or Create the Subject ID (THE OPTIMIZATION)
        const subject_id = await getOrCreateSubject(subject_name, branch_id, year, semester);

        // 3. Get S3 file info
        const file_url = req.file.location;
        const file_key = req.file.key;

        // 4. Save to question_papers table
        await connection.beginTransaction();
        const query = "INSERT INTO question_papers (subject_id, exam_year, file_url, file_key) VALUES (?, ?, ?, ?)";
        await connection.query(query, [subject_id, exam_year || null, file_url, file_key]);
        
        await connection.commit();
        res.status(201).send({ message: 'File uploaded successfully!' });

    } catch (err) {
        await connection.rollback();
        console.error(err);
        res.status(500).send('Server error during upload');
    } finally {
      connection.release();
    }
};

// --- Delete Controller ---
const deletePaper = async (req, res) => {
    const connection = await db.getConnection();
    try {
        const { paperId } = req.params;
        const { fileKey } = req.body; // Get fileKey from request body

        if (!fileKey) {
            return res.status(400).json({ message: 'File key is missing. Cannot delete from S3.' });
        }

        // 1. Delete from S3
        const deleteParams = {
            Bucket: process.env.AWS_BUCKET_NAME,
            Key: fileKey,
        };
        await s3.send(new DeleteObjectCommand(deleteParams));

        // 2. Delete from Database
        await connection.beginTransaction();
        await connection.query("DELETE FROM question_papers WHERE paper_id = ?", [paperId]);
        await connection.commit();

        res.status(200).json({ message: 'Paper deleted successfully from S3 and database.' });
    
    } catch (err) {
        await connection.rollback();
        console.error(err);
        res.status(500).json({ message: 'Server error during deletion.' });
    } finally {
      connection.release();
    }
};

const addBranch = async (req, res) => {
  const connection = await db.getConnection();
  try {
    const { name } = req.body;
    if (!name) {
      return res.status(400).json({ message: 'Branch name is required.' });
    }

    // Check if branch already exists
    const [existing] = await connection.query("SELECT * FROM branches WHERE branch_name = ?", [name]);
    if (existing.length > 0) {
      return res.status(409).json({ message: 'A branch with this name already exists.' });
    }

    // Create new branch
    const [result] = await connection.query("INSERT INTO branches (branch_name) VALUES (?)", [name]);
    const newBranch = { branch_id: result.insertId, branch_name: name };
    
    res.status(201).json({ message: 'Branch added successfully!', branch: newBranch });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error while adding branch.' });
  } finally {
    connection.release();
  }
};

const updateBranch = async (req, res) => {
  const connection = await db.getConnection();
  try {
    const { id } = req.params;
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({ message: 'Branch name is required.' });
    }

    // Check if another branch with this name already exists
    const [existing] = await connection.query(
      "SELECT * FROM branches WHERE branch_name = ? AND branch_id != ?", 
      [name, id]
    );
    if (existing.length > 0) {
      return res.status(409).json({ message: 'Another branch with this name already exists.' });
    }

    // Update the branch
    await connection.query("UPDATE branches SET branch_name = ? WHERE branch_id = ?", [name, id]);
    
    res.status(200).json({ message: 'Branch updated successfully!' });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error while updating branch.' });
  } finally {
    connection.release();
  }
};

const deleteBranch = async (req, res) => {
  const connection = await db.getConnection();
  try {
    const { id } = req.params;

    // 1. SAFETY CHECK: See if any subjects are using this branch
    const [subjects] = await connection.query(
      "SELECT COUNT(*) as count FROM subjects WHERE branch_id = ?",
      [id]
    );

    if (subjects[0].count > 0) {
      // 2. If subjects exist, block the deletion
      return res.status(409).json({ // 409 Conflict
        message: `Cannot delete branch. It is linked to ${subjects[0].count} subject(s).`
      });
    }

    // 3. If no subjects are linked, proceed with deletion
    await connection.query("DELETE FROM branches WHERE branch_id = ?", [id]);
    
    res.status(200).json({ message: 'Branch deleted successfully!' });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error while deleting branch.' });
  } finally {
    connection.release();
  }
};

const updatePaper = async (req, res) => {
  const connection = await db.getConnection();
  try {
    const { paperId } = req.params;
    // Get the new details from the form
    const { branch_id, year, semester, subject_name, exam_year } = req.body;

    if (!branch_id || !year || !semester || !subject_name) {
      return res.status(400).json({ message: 'Missing required fields.' });
    }

    // 1. Get or create the new subject_id based on the form data
    const new_subject_id = await getOrCreateSubject(subject_name, branch_id, year, semester);

    // 2. Update the question_papers table with the new subject_id and exam_year
    await connection.query(
      "UPDATE question_papers SET subject_id = ?, exam_year = ? WHERE paper_id = ?",
      [new_subject_id, exam_year || null, paperId]
    );
    
    res.status(200).json({ message: 'Paper details updated successfully!' });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error while updating paper.' });
  } finally {
    connection.release();
  }
};

module.exports = {
    uploadPaper,
    deletePaper,
    addBranch,
    updateBranch,
    deleteBranch,
    updatePaper
};