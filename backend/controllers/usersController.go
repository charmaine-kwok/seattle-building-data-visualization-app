package controllers

import (
	"api/models"
	"encoding/json"
	"log"
	"net/http"
	"os"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt"
	"golang.org/x/crypto/bcrypt"
)

func Login(c *gin.Context) {
	fileContents, err := os.ReadFile("./data/users.json")
	if err != nil {
		log.Fatalf("Error reading file: %v", err)
	}

	var user models.Credentials
	err = json.Unmarshal(fileContents, &user)
	if err != nil {
		log.Fatalf("Error unmarshaling JSON: %v", err)
	}

	// Get the email and password off req body
	var body models.User

	if c.Bind(&body) != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Failed to read body!",
		})
		return
	}

	// Look up requested user
	if body.Username != user.Username {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Invalid username or password",
		})
		return
	}

	// Compare password hash
	err = bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(body.Password))

	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Invalid username or password",
		})
		return
	}

	// Generate a jwt token
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"sub": user.Username,
		"exp": time.Now().Add(time.Hour * 24 * 30).Unix(),
	})

	// Sign and get the complete encoded token as a string using the secret
	tokenString, err := token.SignedString([]byte(os.Getenv("SECRET")))

	// Send it back
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Invalid to create token",
		})
	}

	// Set cookie
	c.SetSameSite(http.SameSiteLaxMode)
	c.SetCookie("Authorization", tokenString, 3600*24*30, "", "", false, true)

	c.JSON(http.StatusOK, gin.H{
		"token": tokenString,
	})

}

// Logout and clear cookie
func Logout(c *gin.Context) {
	// Clear Authorization cookie
	c.SetCookie("Authorization", "", 0, "", "", false, true)
}
