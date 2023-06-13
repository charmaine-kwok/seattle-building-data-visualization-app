# Use an official Golang runtime as a parent image
FROM golang:1.20.3-alpine AS builder

# Set the working directory to /app
WORKDIR /app

# Copy the current directory contents into the container at /app
COPY . .

RUN apk add build-base

# # Build the Go app
RUN go mod download 

# RUN CGO_ENABLED="0" CGO_ENABLED=0

RUN go build -o main .

# Use an official Alpine Linux runtime as a parent image
FROM alpine:3.17.3

# Set the working directory to /app
WORKDIR /app

# Copy the binary from the build stage to the new container
COPY --from=builder /app/main .

# Copy files
COPY .env users.json data.db ./

# Set the Gin mode to be release
ENV GIN_MODE=release 

# Expose port 8080 to the outside world
EXPOSE 8081

# Run the Go app when the container starts
CMD ["./main"]