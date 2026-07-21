// app.js
import express from 'express';
import cors from 'cors';
import supplierRoute from './controllers/supplier.js';
import categoriesRoute from './controllers/categories.js';
import qualitiesRoute from './controllers/qualties.js';
import productsRoute from './controllers/productsRoute.js';
import designRoute from './controllers/designs.js';
import finishtypeROute from './controllers/finishtype.js';
import feeltypeROute from './controllers/feeltype.js';
import weaveROute from './controllers/weave.js';
import widthRoute from './controllers/width.js';
import unitRoute from './controllers/unit.js'
import cutRoute from './controllers/cut.js'
import userRoute from './routes/userRoute.js';
import challanRote from './controllers/challan.js'
import quickchallanRoute from './controllers/quickChallan.js'
import customerRoute from './controllers/customer.js'
import transportRoute from './controllers/transport.js'
import attributeRoute from './controllers/attribute.js'
import attributevalueRoute from './controllers/attributeValue.js'
import invoiceRoute from './controllers/invoice.js'
import paymentModeRoute from './controllers/paymentMode.js'
import customerPayment from './controllers/customerPayment.js'
import supplierPayment from './controllers/supplierPayment.js'
import customerLedger from './controllers/customerLedger.js'
import supplierLedger from './controllers/supplierLedger.js'


const app = express();

app.use(express.json());
app.use(cors());

app.use('/api', userRoute);
app.use('/api/supplier', supplierRoute);
app.use('/api/category', categoriesRoute);
app.use('/api/quality', qualitiesRoute);
app.use('/api/products', productsRoute);
app.use('/api/design', designRoute);
app.use('/api/finishtype', finishtypeROute);
app.use('/api/feeltype', feeltypeROute);
app.use('/api/weave', weaveROute);
app.use('/api/width', widthRoute);
app.use('/api/unit', unitRoute);
app.use('/api/cut', cutRoute);
app.use('/api/challan', challanRote);
app.use('/api/customer', customerRoute);
app.use('/api/transport',transportRoute );
app.use('/api/attribute', attributeRoute);
app.use('/api/attributeValue',attributevalueRoute);
app.use('/api/quickchallan', quickchallanRoute);
app.use('/api/invoice', invoiceRoute);
app.use('/api/paymentmode', paymentModeRoute);
app.use('/api/customerpayment', customerPayment);
app.use('/api/supplierpayment',supplierPayment  );
app.use('/api/customerledger',customerLedger  );
app.use('/api/supplierledger',supplierLedger );



export default app;
