package main

import (
	"api/controllers"
	"api/initializers"
	"api/middleware"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

func init() {
	// Connect to db
	initializers.ConnectToDB("./data/data.db")
}

func main() {
	defer controllers.CloseDB()

	// Create a new Gin router
	r := gin.Default()

	config := cors.DefaultConfig()
	config.AllowOrigins = []string{"http://localhost:3000"}
	config.AllowMethods = []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"}
	config.AllowHeaders = []string{"Origin", "Content-Type", "Content-Length", "Authorization"}
	// enable credentials
	config.AllowCredentials = true

	r.Use(cors.New(config))

	r.POST("/login", controllers.Login)

	r.GET("/logout", controllers.Logout)

	// base path /api/buildings
	apiGroup := r.Group("/api/buildings")
	{
		// Check if the user is authenticated or not
		apiGroup.Use(middleware.RequireAuth)

		apiGroup.GET("/overview", controllers.GetBuildings)
		apiGroup.GET("/details", controllers.GetBuildingDetails)
		apiGroup.GET("/average", controllers.GetAverageEUI)
		apiGroup.GET(".", controllers.GetBuildingsByParams)
	}

	// listen and serve on 0.0.0.0:8081
	r.Run(":8081")
}
