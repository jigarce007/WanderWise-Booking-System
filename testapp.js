const express = require('express');
const app = express();
const fs = require('fs');
const port = 3000;
app.use(express.json());

const data = fs.readFileSync('./dev-data/data/citytours.json', 'utf-8');
const tours = JSON.parse(data);
// console.log(tours);

const gettours = (req, res) => {
  res.status(200).json({
    status: 'success',
    tours,
  });
};

const gettour = (req, res) => {
  const id = req.params.id * 1;
  const tour = tours.find((el) => el.id === id);
  if (!tour) {
    return res.status(404).json({
      status: 'fail',
      message: 'Invalid ID',
    });
  }
  res.status(200).json({
    status: 'success',
    data: tour,
  });
};

//PSOT A NEW TOUR...
const newtour = (req, res) => {
  console.log(req.body);
  const nID = tours.length + 1;
  const newTour = Object.assign({ id: nID }, req.body);
  tours.push(newTour);
  fs.writeFile(
    './dev-data/data/citytours.json',
    JSON.stringify(tours),
    (err) => {
      res.status(201).json({
        status: 'success',
        data: newTour,
      });
    }
  );
};

//update a tour...
const updatetour = (req, res) => {
  const id = req.params.id * 1;
  if (id > tours.length) {
    return res.status(404).json({
      status: 'fail',
      message: 'Invalid ID',
    });
  }
  res.status(201).json({
    status: 'success',
    message: 'Updated successfully',
  });
};

//delete  a tour...
const deletetour = (req, res) => {
  const id = req.params.id * 1;
  if (id > tours.length) {
    return res.status(404).json({
      status: 'fail',
      message: 'Invalid ID',
    });
  }
  res.status(204).json({
    status: 'success',
    message: 'Deleted successfully',
  });
};

app.route('/api/citytours').get(gettours).post(newtour);
app.route('/api/citytours/:id').post(newtour);
app
  .route('/api/citytours/:id')
  .get(gettour)
  .patch(updatetour)
  .delete(deletetour);
app.listen(port, () => {
  console.log(`server is running on port ${port}`);
});
