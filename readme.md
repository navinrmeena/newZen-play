# creating a vedio streaming plathform 
 
-[model-link](https://app.eraser.io/workspace/YtPqZ1VogxGy1jzIDkzj) 

1. we create folder git but git does not track folders so we also add one file (.gitkeep)

2. and for file git ignore we use gitingnore  online genration it give us all ignored file text genrated

3. we create src folder and add app.js ,index.js

4. then we add type:"module"  in  json 

5. we install nodemon which automaticly start stop server 
    to install it we use commond (npm i -d nodemon) 
    then we add 
      "scripts": {"dev":"nodemon src/index.js"
      },
6. now we make new folders : 
                          
        mkdir controllers DB middlewares models routes utils 
 