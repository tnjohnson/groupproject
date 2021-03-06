// get list of work orders
// get unit they are living in
//on tenant page load
async function getUnitAndWorkOrders (req,res){
    try {
        const db = req.app.get('db');
        const unitInfo = await db.unitInfo([req.params.tenantId])
        res.send(unitInfo, 200)

    } catch (error) {
        console.error(error)
    }
}

async function createWorkOrder (req,res){
try {
    const db = req.app.get('db');
    const newWorkOrder = await db.createWorkOrder([req.body.unitId, req.body.description])
    res.send('success', 200)

} catch (error) {
    console.error(error)
}}

async function getUnitRent (req,res){
    try {
        const db = req.app.get('db');
        const unitRent = await db.getUnitRent([req.params.tenantId])
        res.send(unitRent, 200)
    } catch (error) {
        console.error(error)
    }
}

async function getTenantBalance (req, res) {
    try {
        const db = req.app.get('db');
        const tenantBalance = await db.getTenantBalance([req.params.tenantId]);
        res.send(tenantBalance, 200);
    } catch (error) {
        console.error(error);
    }
}
module.exports ={
    getUnitAndWorkOrders, createWorkOrder, getUnitRent, getTenantBalance
}