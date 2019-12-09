module.exports = {
  name: "p.firstName^^text",
  default_name: ".nonExistingProperty||>>this_should_be_the_firstName",
  nickname: "#nickname||>>nickname_not_found",
  isNickNameFound: "#nickname^^text||>>%false",
  isDynamicDefault: "#nickname^^text||p.firstName^^text",
  fullName:
    "@concatName(p.firstName^^text|.middleName^^text||>>AbdelMuti|#lastName^^text)",
  bio: "article#bio^^data(bio)",
  fullName_default:
    "@concatName(p.firstName^^text|.middleName^^text||@concatName(nonExistingProperty)||>>AbdelMuti|#lastName^^text)",
  fullNameDefaultHardcoded: "@concatName(nonExistingProperty)||>>default",
  fullName_withNotFoundMiddle:
    "@concatName(.firstName^^text|fullName.middleName|#lastName^^text)",
  fullNameDefault: "!fullName_withNotFoundMiddle",
  completeName: "@concatName(p.firstName^^text|!fullName)",
  displayName: "!fullName",
  email: {
    value: "email^^text"
  },
  links: {
    $output: [],
    $innerDocument: "#links*",
    $push: true,
    $mappings: {
      $value: ".link^^text"
    }
  },
  links_all: [
    {
      $output: [],
      $innerDocument: "#links*",
      $push: true,
      $mappings: {
        $value: ".link^^text"
      }
    },
    {
      $output: [],
      $innerDocument: "ul[data-class='social_links']*",
      $push: true,
      $mappings: {
        $value: ".link^^attr(value)"
      }
    }
  ],
  social_links_objectified: [
    {
      $output: {},
      $innerDocument: "#links*",
      $required: ["value"],
      $key: ".link^^text",
      $mappings: {
        value: ".link^^text",
        type: ">>test",
        order: "$key",
        social: ">>%true"
      }
    },
    {
      $output: {},
      $innerDocument: "ul[data-class='social_links']*",
      $required: ["value"],
      $key: ".link^^attr(value)",
      $mappings: {
        value: ".link^^attr(value)",
        service: "@getLinkService(.link^^attr(value)|.link^^text)",
        type: ">>social"
      }
    }
  ],
  social_links: [
    {
      $output: [],
      $innerDocument: "#links*",
      $required: ["value"],
      $mappings: {
        value: ".link^^text",
        type: ">>test",
        order: "$key",
        social: ">>%true"
      }
    },
    {
      $output: [],
      $innerDocument: "ul[data-class='social_links']*",
      $required: ["value"],
      $mappings: {
        value: ".link^^attr(value)",
        service: "@getLinkService(.link^^attr(value)|li^^text)",
        type: ">>social"
      }
    }
  ],
  messaging: {
    $output: [],
    $innerDocument: "article.linksv2 ul:nth-child(2)*",
    $required: ["value"],
    $mappings: {
      service: "@getLinkService(li^^text|li^^attr(data-service))",
      type:
        "@getLinkType(li^^text|@getLinkService(li^^text,li^^attr(data-service)))",
      value:
        "@cleanURI(li^^text|@getLinkType(li^^text,@getLinkService(li^^text,li^^attr(data-service))))??@getLinkType(li^^text|@getLinkService(li^^text,li^^attr(data-service)))#===#>>messaging"
    }
  },
  website_addresses_keyless: {
    $output: [],
    $innerDocument: "article.linksv2 ul:nth-child(2)*",
    $required: ["value"],
    $mappings: {
      value: "li^^text??li^^attr(type)#===#>>website",
      owner: ">>ahmadassaf??li^^text#===#>>https://gravatar.com/ahmadassaf",
      type: ">>website"
    }
  },
  social_media_addresses: {
    $output: [],
    $innerDocument: "article.linksv2 ul:nth-child(2)*",
    $required: ["value"],
    $mappings: {
      value:
        "@transformTwitterHandle(li^^text)??li^^attr(data-service)#===#>>twitter"
    }
  },
  social_links_objects: {
    $output: {},
    $innerDocument: "#links*",
    $key: "@generateId(li^^text)",
    $mappings: {
      value: "li^^text"
    }
  },
  experience: {
    $output: [],
    $innerDocument: "#work*",
    $mappings: {
      name: "li span:first-child^^text",
      role: "li span:nth-child(2)^^text",
      startDate: "@parseDate(li span.workData^^text)",
      current: "li span:last-of-type^^text%%BOOLEAN"
    }
  },
  experience_primary: {
    values: {
      $output: {},
      $key: "@generateId(title|company)",
      $mappings: {
        id: "@generateId(title|company)",
        role: "title",
        organisationName: "company"
      }
    }
  },
  primaryExperience: "!experience[0]",
  primaryRole: "!experience[0].role",
  experiences: {
    $output: [],
    $innerDocument: "#work*",
    $push: true,
    $mappings: {
      $value: "li span:first-child^^text"
    }
  },
  experience_object: {
    values: {
      $output: {},
      $innerDocument: "#work*",
      $key: "@generateId(li span:first-child^^text|li span:nth-child(2)^^text)",
      $mappings: {
        id: "@generateId(li span:first-child^^text|li span:nth-child(2)^^text)",
        name: "li span:first-child^^text",
        role: "li span:nth-child(2)^^text",
        startDate: "li span.workData^^text",
        current: "li span:last-child^^text%%BOOLEAN"
      }
    }
  },
  education: {
    $output: [],
    $innerDocument: ".education*",
    $mappings: {
      universityName: "li span:first-child^^text",
      degree: "li span:nth-child(2)^^text",
      location: "li span:nth-child(3)^^text"
    }
  },
  education_object: {
    $output: {},
    $innerDocument: ".education*",
    $key: "@generateId(li span:first-child^^text|li span:nth-child(2)^^text)",
    $mappings: {
      degree: "li span:nth-child(2)^^text",
      location: "li span:nth-child(3)^^text||>>N/A",
      universityName: "li span:first-child^^text"
    }
  },
  education_object_location: {
    $output: {},
    $required: ["universityName", "location"],
    $innerDocument: ".education*",
    $key: "@generateId(li span:first-child^^text|li span:nth-child(2)^^text)",
    $mappings: {
      degree: "li span:nth-child(2)^^text",
      location: "li span:nth-child(3)^^text"
    }
  },
  primaryPhoto: "@createURL(>>http://photo.com/|!fullNameDefault)",
  createdAt: "@!new Date('2019').toISOString()"
};
