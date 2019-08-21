import { INVALID_ARTICLE_SECTIONS } from '../config/'

export const setValue = (field, value, source = null) => {
  field.value = value;
  field.reviewedOn = new Date().toISOString();
  if (source) {
    if (Array.isArray(field.sources)) {
      field.sources.push(source)
    } else {
      field.sources = [source]
    }
  }
  return field
}

export const getValue = (field) => {
  try{
    return field.value
  } catch {
    return null
  }
}

export const setScore = (article) => {
  let score = 100;
  const _setScore = (actual, value) => {
    return actual + value > 100
      ? 100
      : actual + value < 0
      ? 0
      : actual + value;
  };

  if (!article.data.lang) {
    score = _setScore(score, -10);
  }

  score = Object.keys(article.requirements).reduce(
    (actualScore, requirement) => {
      if (!getValue(article.requirements[requirement])) {
        actualScore = _setScore(actualScore, -10);
      }
      return actualScore;
    },
    score
  );
  article.score = score;
  return article;
}

export const setReviewed = (article) => {
  const isReviewed = requirement => {
    return requirement.reviewedOn && requirement.reviewedOn !== null;
  };

  article.reviewed =
    Object.keys(article.requirements).every(requirement => {
      if (Array.isArray(article.requirements[requirement])) {
        return article.requirements[requirement].every(isReviewed);
      }
      return isReviewed(article.requirements[requirement]);
    }) && getValue(article.lang);
  return article;
}

export const inValidSection = (article) => {
  return !INVALID_ARTICLE_SECTIONS.find((section) => article.data.section === section)
}