package serializers

// export interface Profile {
// 	name: string
// 	title: string
// 	bio: string
// 	expertise: {
// 	  title: string
// 	  description: string
// 	  icon: string
// 	}[]
// 	skills: {
// 	  name: string
// 	  value: number
// 	}[]
// 	technologies: string[]
// 	contact: {
// 	  email: string
// 	  linkedin: string
// 	  github: string
// 	  twitter: string
// 	}
// 	resumeUrl: string
//   }

type Expertise struct {
	Title       string `json:"title"`
	Description string `json:"description"`
	Icon        string `json:"icon"`
}

type Skill struct {
	Name  string  `json:"name"`
	Value float32 `json:"value"`
}

type Contact struct {
	Email    string `json:"email"`
	Linkedin string `json:"linkedin"`
	Github   string `json:"github"`
	Twitter  string `json:"twitter"`
}

type ProfileResponse struct {
	Name         string      `json:"name"`
	Title        string      `json:"title"`
	Bio          string      `json:"bio"`
	Expertise    []Expertise `json:"expertise"`
	Skills       []Skill     `json:"skills"`
	Technologies []string    `json:"technologies"`
	ResumeUrl    string      `json:"resumeUrl"`
	Contact      Contact     `json:"contact"`
}
