require("dotenv").config()
const express = require("express");
const app = require("express")();
const session = require("express-session");
const bodyParser = require("body-parser");
const cors = require("cors");
const massive = require("massive");
const path = require("path");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
// add process.env to make the above key secret.
const logincontroller = require('./controller/logincontroller')
const managercontroller = require('./controller/managercontroller')
const tenantcontroller = require('./controller/tenantcontroller')
const messagecontroller = require('./controller/messagescontroller')
const tempcontroller = require('./controller/tempcontroller')

app.use(cors({credentials: true, origin: 'http://localhost:3000'}));

massive(process.env.DATABASE_URL).then(db => {
    console.log("connected to db");
    app.set("db", db);
    // return db.seedfile();
  })
  .catch(error => console.error(error));

app.use(
  session({
    secret: "super simple",
    maxAge: 500000,
    resave: true,
    saveUninitialized: true
  })
);

app.use(express.static(path.join(__dirname, "build")));
app.use(bodyParser.json());

// login
app.post('/api/login', logincontroller.login)
app.get('/api/user', logincontroller.sendSessionUser)
// logout
app.get('/api/logout', logincontroller.logoutUser)

//tenants

// unit for a tenant work orders for a tenant
app.get('/api/tenant/unitinfo/:tenantId', tenantcontroller.getUnitAndWorkOrders)
//create work order
app.post('/api/tenant/workorder/new', tenantcontroller.createWorkOrder)

//work order

// list of work orders management
app.get('/api/manager/workorders/:managerId', managercontroller.getWorkOrdersManager)
//create new work order
app.post('/api/manager/workorder/new', managercontroller.createWorkOrder)
// modify work order
app.put('/api/manager/modify/workorder/:workOrderId', managercontroller.updateWorkOrder)
// complete work order
app.put('/api/manager/workorder/:workOrderId', managercontroller.completeWorkOrder)
//delete work order
app.delete('/api/manager/delete/workorder/:workOrderId', managercontroller.deleteWorkOrder)


//management
// list of tenants
app.get('/api/manager/tenants/:managerId', managercontroller.getTenants)
// list of units for a manager
app.get('/api/manager/units/:managerId', managercontroller.getUnits)
// create a new user(tenant)
app.post('/api/manager/tenants/new', logincontroller.createNewTenant)
// modify tenant
app.put('/api/manager/modify/tenant/:tenantId', managercontroller.updateTenant)
//delete tenant
app.delete('/api/manager/delete/tenant/:tenantId', managercontroller.deleteTenant)
//create new unit
app.post('/api/manager/units/new/:managerId', managercontroller.createNewUnit)
//delete unit
app.delete('/api/manager/delete/unit/:unitId', managercontroller.deleteUnit)
// create comment
app.post('/api/manager/comments/new', managercontroller.createComment)
// get rent
app.get('/api/tenant/unit/rent/:tenantId', tenantcontroller.getUnitRent)

//email section
// new account email
app.post('/api/email', messagecontroller.sendMail)
// tenant to manager from form submission
app.post('/api/email/tenant', tempcontroller.tenantMail)
//get manager email
app.get('/api/manageremail/:unitId', tempcontroller.getManagerEmail)
//get tenant email
app.get('/api/tenantemail/:unitId', tempcontroller.getTenantEmail)

//charge - credit card
app.post("/charge", async (req, res) => {
  try {
    payment = req.body.payment * 100;
    console.log("payment", req.body.payment);
    let { status } = await stripe.charges.create({
      amount: parseInt(payment),
      currency: "usd",
      description: "An example charge",
      source: req.body.id
    });
    // insert into DB payment history, can do in main app.
    res.json({ status });
  } catch (err) {
    console.log(err);
    res.status(500).end();
  }
});


app.listen(process.env.PORT || 8080, () => {
  console.log("listening");
});
