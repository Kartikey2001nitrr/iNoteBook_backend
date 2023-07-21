const express = require("express");
const fetchUser = require("../middleware/fetchUser");
const router = express.Router();
const Notes = require("../models/Notes");
const { body, validationResult } = require("express-validator");

//Route 1: Get all the notes of a user: GET "/api/notes/fetchallnotes".
router.get("/fetchallnotes", fetchUser, async (req, res) => {
    const notes = await Notes.find({user: req.user.id});
    res.json(notes);
});

//Route 2: Adding notes of a user: POST "/api/notes/addnote".
router.post(
    "/addnote",fetchUser,
    [
      body("Title", "Title must be atleast 5 characters").isLength({ min: 5 }),
      body("Description", "Description must be atleast 8 characters").isLength({ min: 8 }),
    ],
    async (req, res) => {
      //if there are error return bad request and the errors
  
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
  
      try {
        const {Title,Description,Tag} = req.body;
        const note = new Notes({
            Title,Description,Tag,user:req.user.id
        })
        const savedNote = await note.save();
        res.json(savedNote);
      } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
      }
    }
  );

//Route 3: Updateing notes of a user: PUT "/api/notes/updatenote".
router.put(
    "/updatenote/:id",fetchUser,
    [
      body("Title", "Title must be atleast 5 characters").isLength({ min: 5 }),
      body("Description", "Description must be atleast 8 characters").isLength({ min: 8 }),
    ],
    async (req, res) => {
      //if there are error return bad request and the errors
  
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
  
      try {
        const {Title,Description,Tag} = req.body;
        const newnote = {};
        if(Title) {newnote.Title = Title};
        if(Description) {newnote.Description = Description};
        if(Tag) {newnote.Tag = Tag};


        //Find the note to be updated and update it.
        let note = await Notes.findById(req.params.id);
        if(!note)
        {
            return res.status(404).send("NOT FOUND");
        }

        if(note.user.toString() !== req.user.id)
        {
            return res.status(404).send("NOT FOUND");
        }

        note = await Notes.findByIdAndUpdate(req.params.id, {$set: newnote}, {new:true});
        res.json({"Status":"Updated Successfully",note});

      } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
      }
    }
  );

//Route 4: deleteing notes of a user: PUT "/api/notes/deletenote".
router.delete(
    "/deletenote/:id",fetchUser,
    async (req, res) => {
      //if there are error return bad request and the errors
  
      try {
        let note = await Notes.findById(req.params.id);
        if(!note)
        {
            return res.status(404).send("NOT FOUND");
        }

        if(note.user.toString() !== req.user.id)
        {
            return res.status(404).send("NOT FOUND");
        }

        note = await Notes.findByIdAndDelete(req.params.id);
        res.json({"Status":"Deleted Successfully",note});

      } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
      }
    }
  );

module.exports = router;
