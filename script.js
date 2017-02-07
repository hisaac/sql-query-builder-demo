$(document).ready(function() {
  
  let query;

  $("submit").click(function(event){
    event.preventDefault();
    $('#outputCode').html()
  });

});

// Constructs SQL query based off of user defined search paramaters ----------//
function queryBuilder(object) {
  var index = 0;
  var query = 'SELECT * FROM mentors WHERE ';

  if (object.generic_search) {
    index++;
    query +=
      '(first_name ILIKE $'       + index +
      ' OR last_name ILIKE $'     + index +
      ' OR blurb ILIKE $'         + index +
      ' OR bio ILIKE $'           + index +
      ' OR company ILIKE $'       + index +
      ' OR job_title ILIKE $'     + index +
      ' OR race ILIKE $'          + index +
      ' OR gender ILIKE $'        + index +
      ' OR orientation ILIKE $'   + index +
      ' OR school ILIKE $'        + index +
      ' OR degree ILIKE $'        + index +
      ' OR major ILIKE $'         + index +
      ' OR languages ILIKE $'     + index +
      ')';
  }

  for (var property in object) {
    if (object[property]) {
      if (property === 'generic_search') {
        query += ' AND ';
      } else if (property === 'gender') {
        index++;
        query += property + ' = $' + index + ' AND ';
      } else {
        index++;
        query += property + ' ILIKE $' + index + ' AND ';
      }
    }
  }

  if (query.endsWith('WHERE ')) {
    query = 'SELECT * FROM mentors';
  } else if (query.endsWith('AND ') || query.endsWith(' AND')) {
    query = query.slice(0, -4);
  }

  return query;
}
//----------------------------------------------------------------------------//

// Constructs SQL query based off of updated FAQ info ------------------------//
function faqEditQueryBuilder(faqArray, userId) {

  var queryString = '';
  var propertyArray = [];
  var questionString = '';
  var answerString = '';
  var loopTracker = 0;
  var index;

  for (index = 0; index < faqArray.length; index++) {
    loopTracker++;
    questionString += ' WHEN $' + loopTracker;
    loopTracker++;
    questionString += ' THEN $' + loopTracker;
  }

  for (index = 0; index < faqArray.length; index++) {
    loopTracker++;
    answerString += ' WHEN $' + loopTracker;
    loopTracker++;
    answerString += ' THEN $' + loopTracker;
  }

  queryString +=
    'UPDATE faq ' +
    'SET question = CASE id' + questionString + ' END, ' +
    'answer = CASE id' + answerString + ' END';

  for (index = 0; index < faqArray.length; index++) {
    propertyArray.push(faqArray[index].faq_id, faqArray[index].question);
  }

  for (index = 0; index < faqArray.length; index++) {
    propertyArray.push(faqArray[index].faq_id, faqArray[index].answer);
  }

  return {
    queryString: queryString,
    propertyArray: propertyArray
  };
}
//----------------------------------------------------------------------------//

