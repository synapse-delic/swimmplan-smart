FROM nginx:alpine

# Copy the custom nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy the pre-built application from local dist folder
COPY dist /usr/share/nginx/html

# Expose port 8080 (Cloud Run default)
EXPOSE 8080

CMD ["nginx", "-g", "daemon off;"]
