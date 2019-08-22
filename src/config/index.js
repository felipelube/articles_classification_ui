export const API_SERVER = process.env.API_SERVER || 'http://localhost:5000'

export const API_ENDPOINT_ARTICLES = process.env.API_ENDPOINT_ARTICLES || "/api/articles"
export const API_ENDPOINT_ARTICLE = process.env.API_ENDPOINT_ARTICLES || "/api/article/"
export const INVALID_ARTICLE_SECTIONS = process.env.INVALID_ARTICLE_SECTIONS && process.env.INVALID_ARTICLE_SECTIONS.split(',') || ['reviews', 'presentation', 'preface']


export const REQUIREMENT_FIELDS_INFO = [
  {
    name: 'titleLangEnglish',
    title: 'Título em inglês?',
    type: 'boolean',
    component: 'b-checkbox',

  },
  {
    name: 'titlePresence',
    title: 'Título presente no PDF?',
    type: 'boolean',
    component: 'b-checkbox',

  },
  {
    name: 'abstractLangEnglish',
    title: 'Abstract em inglês?',
    type: 'boolean',
    component: 'b-checkbox',

  },
  {
    name: 'abstractPresence',
    title: 'Abstract presente no PDF?',
    type: 'boolean',
    component: 'b-checkbox',

  },
  {
    name: 'authorsPresence',
    title: 'Autores presentes no PDF?',
    type: 'boolean',
    component: 'b-checkbox'
  },
  {
    name: 'originalTitlePresence',
    title: 'Titulo original presente no PDF?',
    type: 'boolean',
    component: 'b-checkbox'
  },
  {
    name: 'referencesInRomanScript',
    title: 'Todas referências no alfabeto romano?',
    type: 'boolean',
    component: 'b-checkbox'
  },
  {
    name: 'lang',
    title: 'Linguagem do artigo',
    type: 'string',
    component: 'LanguageField',
  },
]