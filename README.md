# imageProcessor
## Steps to run application
### Step 1
Change permission on `entrypoint.sh` file by running 
```
chmod +x api/entrypoint.sh
```

### Step 2
Create .env file in the image_app folder and add this environment variable
```
REACT_APP_BASE_URL=http://127.0.0.1:5002/
```



### Step 3
To run the app in a Docker container, you will need to have Docker installed on your machine. If you do not have Docker installed, you can download it from the official Docker website (https://www.docker.com/).


Once you have Docker installed, follow these steps to run the app in a Docker container:

- Open a terminal window and navigate to the root directory of the app.
- Build the Docker image for the app by running the following command:
    ```
    docker-compose up
    ```
This would start the application on port 3000 and the api on port 5002.

Visit 127.0.0.1:3000 to access the application