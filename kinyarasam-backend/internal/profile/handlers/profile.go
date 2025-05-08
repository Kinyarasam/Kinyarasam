package handlers

import (
	"net/http"

	"github.com/kinyarasam/kinyarasam/internal/core/utils"
	"github.com/kinyarasam/kinyarasam/internal/profile/serializers"
	"github.com/sirupsen/logrus"
)

func GetProfile(w http.ResponseWriter, r *http.Request) {

	technologies := []string{
		"JavaScript", "TypeScript", "React", "Next.js", "Node.js",
		"Python", "AWS", "Docker", "CI/CD", "Network Protocols",
		"5G Technologies", "VoIP", "SDN", "Network Security",
	}

	response := serializers.ProfileResponse{
		Name:         "Kinyara Samuel Gachigo",
		Title:        "Software Engineer & Telecoms Expert",
		Bio:          "I'm a passionate software engineer with a background in telecommunications. With over 5 years of experience in developing web applications and network systems, I specialize in creating efficient, scalable, and user-friendly solutions.",
		ResumeUrl:    "",
		Technologies: technologies,
		Contact: serializers.Contact{
			Email:    "skinyara.30@gmail.com",
			Linkedin: "",
			Github:   "https://github.com/kinyarasam",
			Twitter:  "",
		},
		Expertise: []serializers.Expertise{
			{
				Title:       "Software Engineer",
				Description: "Full-stack development with modern frameworks and cloud technologies.",
				Icon:        "Code",
			},
			{
				Title:       "Telecommunications",
				Description: "Network protocols, VoIP systems, and wireless communications.",
				Icon:        "Wifi",
			},
		},
		Skills: []serializers.Skill{
			{Name: "JavaScript", Value: 0.9},
			{Name: "React", Value: 0.85},
			{Name: "Node.js", Value: 0.8},
			{Name: "Network Protocols", Value: 0.75},
			{Name: "VoIP", Value: 0.7},
			{Name: "Cloud", Value: 0.65},
			{Name: "Python", Value: 0.6},
			{Name: "5G", Value: 0.55},
		},
	}
	if err := utils.WriteHTTPResponse(w, utils.Response{
		Success: true,
		Message: "Profile retrieved successfully",
		Data:    response,
	}, http.StatusOK); err != nil {
		logrus.WithError(err).Error("Failed to write profile response")
		utils.HandleInternalServerError(w, "Failed to process profile data")
	}
}
