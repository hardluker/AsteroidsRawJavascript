# Use an official Nginx image based on Alpine Linux as the base image
FROM nginx:alpine

# Copy the HTML files into the Nginx web directory
COPY . /usr/share/nginx/html

# Expose port 80
EXPOSE 80

# Command to run Nginx in the foreground
CMD ["nginx", "-g", "daemon off;"]
