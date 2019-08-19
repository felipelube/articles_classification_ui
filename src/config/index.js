export const API_SERVER = process.env.API_SERVER || 'http://localhost:5000'

export const API_ENDPOINT_ARTICLES = process.env.API_ENDPOINT_ARTICLES || "/api/articles"
export const API_ENDPOINT_ARTICLE = process.env.API_ENDPOINT_ARTICLES || "/api/article/"


export const REQUIREMENT_FIELDS_INFO = [
  {
    name: 'titleLangEnglish',
    title: 'Título em inglês?',
    component: 'b-checkbox',

  },
  {
    name: 'titlePresence',
    title: 'Título presente no PDF?',
    component: 'b-checkbox',

  },
  {
    name: 'abstractLangEnglish',
    title: 'Abstract em inglês?',
    component: 'b-checkbox',

  },
  {
    name: 'abstractPresence',
    title: 'Abstract presente no PDF?',
    component: 'b-checkbox',

  },
  {
    name: 'lang',
    title: 'Linguagem do artigo',
    component: 'LanguageField',
    
  },
  {
    name: 'referencesInRomanScript',
    title: 'Todas referências no alfabeto romano?',
    component: 'b-checkbox'
  },
  {
    name: 'referencesPage',
    title: 'Página com as referências'
  },
  {
    name: 'authorsPresence',
    title: 'Autores presentes no PDF?',
    component: 'b-checkbox'
  },
  {
    name: 'originalTitlePresence',
    title: 'Titulo original presente no PDF?',
    component: 'b-checkbox'
  }
]