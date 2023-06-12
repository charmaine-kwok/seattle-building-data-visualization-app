package main

import (
	"api/controllers"
	"api/initializers"
	"api/middleware"

	"log"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
)

func OptionMessage(c *gin.Context) {
	c.Header("Access-Control-Allow-Origin", "http://localhost:8081")
	c.Header("Access-Control-Allow-Methods", "GET, OPTIONS, POST, PUT")
}

func init() {
	// Load environment variables
	err := godotenv.Load()
	if err != nil {
		log.Fatal("Error loading .env file")
	}

	// Connect to db
	initializers.ConnectToDB("../data.db")
}

func main() {
	defer controllers.CloseDB()
	r := gin.Default()

	config := cors.DefaultConfig()
	config.AllowOrigins = []string{"http://localhost:3000"}
	config.AllowMethods = []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"}
	config.AllowHeaders = []string{"Origin", "Content-Type", "Content-Length", "Authorization"}
	config.AllowCredentials = true // add this line to enable credentials

	r.Use(cors.New(config))

	r.POST("/login", controllers.Login)
	r.GET("/overview", middleware.RequireAuth, controllers.GetBuildings)
	r.GET("/details", middleware.RequireAuth, controllers.GetBuildingsDetails)

	// Logout and clear cookie
	r.GET("/logout", controllers.Logout)

	// listen and serve on 0.0.0.0:8081
	r.Run(":8081")
}
