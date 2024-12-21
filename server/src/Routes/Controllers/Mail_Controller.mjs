import db from "../../Database/DB_Connect.mjs"


const allMails = async(req,res)=>{
    const response = await db.query("SELECT * FROM mail")

    res.status(200).json(response.rows)
}

const sendMails = async(req,res)=>{
    const {admin, title, aplicant_name, aplicant_email, reply, type, date, is_reply} = req.body

    const response = await db.query("INSERT INTO mail (admin , title, aplicant_name, aplicant_email, reply, type, date, is_reply) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)", 
        [admin, title, aplicant_name, aplicant_email, reply, type, date, is_reply]
    )

    res.status(200).json(response.rows)
}

const replyMails = async(req,res)=>{
    const {parent_id, title, admin, aplicant_name, aplicant_email, reply, type, date, is_reply} = req.body

    const response = await db.query("INSERT INTO mail (parent_id, title, admin, aplicant_name, aplicant_email, reply, type, date, is_reply) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)", 
        [parent_id, title, admin, aplicant_name, aplicant_email, reply, type, date, is_reply]
    )

    res.status(200).json(response.rows)
}


const deleteReply = async(req,res) =>{
    const {id} = req.params
    await db.query("DELETE FROM mail where id = $1", [id])
    res.status(200).json({ message: "Reply deleted successfully." });
}

export {allMails , sendMails, replyMails, deleteReply}