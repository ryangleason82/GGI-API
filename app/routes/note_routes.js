var ObjectID = require('mongodb').ObjectID;

module.exports = (app, db) => {


    app.get('/rglistings', async function (req, res){
        
        try{
            var arr = await db.collection('rgnew').find().toArray();
            console.log("hi");
            res.send(JSON.stringify(arr, null, 2));
        }
        catch(err){
            console.log('bye');
            console.error(err);
        }
    });

    app.get('/rglistings/:id', (req, res) => {
        const id = JSON.parse(req.params.id).toString();
        console.log(id);
        const details = { mlsnum: id };
        db.collection('rglistings').findOne(details, (err, item) => {
            if (err){
                res.send({'error': 'An error has occurred :('});
            } else{
                res.send(item);
            }
        });
    });

    app.post('/rglistings', (req, res) => {
        const note = { address: req.body.address,
             mlsnum: req.body.mlsnum };
        db.collection('rglistings').insertOne(note, (err, result) => {
            if (err){
                res.send({ 'error': 'An error has occurred' });
            } else{
                res.send(result.ops[0]);
            }
        });
    });

    app.post('/rglistings/all', async function (req, res) {
        mls_data = require('C:/Users/Ryan Gleason/Documents/GGIAPI/mlsdata.json');
		for (listing of mls_data) {
			
			listing.mlsnum = listing.mlsnum.toString();
			listing._id = listing.mlsnum;

			if (listing.listdate != null) listing.listdate = new Date(listing.listdate);
			if (listing.solddate != null) listing.solddate = new Date(listing.solddate);
			if (listing.expiredate != null) listing.expiredate = new Date(listing.solddate);
			
			// test for string type - will not convert null, undefined, or something that is already a number
			if (typeof(listing.currentprice) === 'string') listing.currentprice = Number(listing.currentprice.replace(/[^0-9\.-]+/g,""));
			if (typeof(listing.listprice) === 'string') listing.listprice = Number(listing.listprice.replace(/[^0-9\.-]+/g,""));
			if (typeof(listing.soldprice) === 'string') listing.soldprice = Number(listing.soldprice.replace(/[^0-9\.-]+/g,""));
			if (typeof(listing.OriginalPrice) === 'string') listing.OriginalPrice = Number(listing.OriginalPrice.replace(/[^0-9\.-]+/g,""));
			
			listing.fullAddress = listing.address + ", " + listing.city + ", " + listing.state + " " + listing.zip;
			listing.locationSuggest = listing.city;

			try {
				await db.collection('rgnew').insertOne(listing)
				console.log(listing.fullAddress + ' inserted');
			}
            catch (err) { throw (err) }
        }
    })


    app.delete('/rglistings/:id', (req,res) => {
        const id = req.params.id;
        const details = { '_id': new ObjectID(id) };
        db.collection('rglistings').remove(details, (err, item) => {
            if (err){
                res.send({'error': 'An error has occurred :('});
            } else{
                res.send('Note ' + id + ' deleted!');
            }
        });
    });
    app.put('/rglistings/:id', (req, res) => {
        const id = req.params.id;
        const details = { '_id': new ObjectID(id) };
        const note = { text: req.body.body, title: req.body.title };
        db.collection('notes').update(details, note, (err, result) => {
          if (err) {
              res.send({'error':'An error has occurred'});
          } else {
              res.send(note);
          } 
        });
      });
};