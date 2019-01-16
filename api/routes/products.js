const express = require('express');
const router = express.Router();
const multer = require("multer");
const checkAuth = require('../middleware/check-auth');
const ProductsController = require('../controllers/products');

const storage = multer.diskStorage({
   destination:(req,file,cb)=>{
        cb(null, './uploads');
   },
   filename: (req,file,cb)=>{
        cb(null, new Date().toISOString() + file.originalname);
   } 
});

const fileFilter = (req,file,cb)=> {
    // reject a file
    if(file.mimetype === 'image/jpeg' || file.mimetype === 'image/png'){
        cb(null,true);
    }
    else{
        cb(null,false);
    }
};

// pass our storage to upload object
// with file size limit equals 5mb and file filter 
const upload = multer({
    storage: storage, 
    limits:{
        fileSize: 1024 * 1024 * 5
    },
    fileFilter:fileFilter
});

// Handle incoming requests to /products
router.get('/', ProductsController.products_get_all_products);

router.post('/', checkAuth, upload.single('productImage'), ProductsController.products_create_product);

router.get('/:productId', ProductsController.products_get_product);

router.patch('/:productId', checkAuth, ProductsController.products_update_product);

router.delete('/:productId', checkAuth, ProductsController.products_delete_product);

module.exports = router;