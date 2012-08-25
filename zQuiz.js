/****
zQuiz.js v 0.0.1 - (C) 2012 Ziggy Jonsson ziggy.jonsson.nyc@gmail.com

Creates multiple choice questions from a definition object.

The key input is an array of definitions

Each definition is an associative array with key being "category" and value as the "attribute" for that category
Wrong answers in multiple choice are values of same category for other definitions (where the category exists)


Any definition key that starts with an underscore is not incorporated into questions.
This allows the definition of two special keys:
    _ignore : true      any line with this attribute will be ignored in question generation. 
                        however the properties of the line will still be used for "wrong answers"
    _group : string     Allows grouping of definitions together.   Any definition with a defined group
                        will only seek wrong answers from definitions belonging to the same group
                        unless the ignoreGroups option is selected
                        


Options:
    maxQuestions:   Maximum number of questions returned
    maxSel:         Maximum number of wrong answers (candidates) provided for each question
    includeAnswer:  Include the correct answer in the list of candidates
    
    noQuestions:    List of categories that will not form an answer  
    noAnswers:      List of categories that will not form a question  
    onlyQuestions:  If defined, answer-keys will only be from this list
    onlyAnswers:    If defined, questions-key will only be from this list
    noGroups:       If true then the _group property will be ignored and candidates will be
                    selected from all definitions sharing same category key
    
    Advanced:
    callback:       function to process each resulting question.
                    by default this function returns the inputs as an asso
                    {qkey,akey,qdef,adef,candidates,line,lineNum}
    
*/


if (typeof zQuiz != "object") zQuiz = {};

(function() {
  zQuiz.multi = function multi(q,options) {
    var questions = []
        ,defs={}
    options = options || {}
      
    // Helper functions
    function randOrd(a,b){ return (a.defNum != b.defNum) ? (a.defNum-b.defNum) : (Math.round(Math.random())-0.5); }
    function toArray(s) {  return (s==null) ? [] : (typeof(s) == "object" && !isNaN(s.length)) ? s : [s]   }
    function toSet(s) { var set = {}; toArray(s).forEach(function(d) { set[d] = true}); return set}
    
    // Assign default values for any undefined options
    var defaults = {
        maxSel:3, 
        maxQuestions:999999,
        callback : Object,
        includeAnswer: false
    }
    Object.keys(defaults).forEach(function(key) { if(options[key]==null) options[key] = defaults[key]});
      
    // Create sets for the inclusion/exclusion filters
    var sets= {};
    ["noAnswer","noQuestion","onlyAnswer","onlyQuestion","onlyLines"]
        .forEach(function(d) {sets[d] = toSet(options[d])})
    
    // Create a category tree with keys  defs[category][definition]=count
    q.forEach(function(line) {
      var group = (!options.noGroups && line['_group']) ? line['_group'] : '';
      Object.keys(line).forEach(function(key) {
        if (key[0] == '_') return
        var id = group+'#'+key
        if(!defs[id]) defs[id] = {}
        toArray(line[key]).forEach(function(item) {
          if(!defs[id][item]) { defs[id][item] = 1}
        })
      })
    })

    q.forEach(function(line,lineNum) {
      // If we are supposed to ignore this definition we break
      if (line._ignore) return  
      
      // if onlyLines is set, we break if the line is not in the array
      if (options.onlyLines && !(lineNum in sets.onlyLines)) return  
      
      // Loop through all keys and define them as "question keys"
      Object.keys(line).forEach(function(qkey) {
    
        // If the key is a control key (starts with '_'), is in NoQuestions set, or not in onlyQuestion set (if defined)
        // then break
        if ((qkey[0] == '_') || (qkey in sets.noQuestion) || (options.onlyQuestion && !(qkey in sets.onlyQuestion))) return
        Object.keys(line).forEach(function(akey) {
          if ((akey[0] == '_') || (akey == qkey) || (akey in sets.noAnswer) || (options.onlyAnswer && !(akey in sets.onlyAnswer))) return
          
          toArray(line[qkey]).forEach(function(qdef,qdefNum) {
            var correctAnswers = toSet(line[akey])
            toArray(line[akey]).sort(randOrd).forEach(function(adef,adefNum) {
              var group = (!options.noGroups && line['_group']) ? line['_group'] : '', id = group+'#'+akey
              var candidates = Object.keys(defs[id]).filter(function(d) { return !(d in correctAnswers)}).slice(0,options.maxSel)
              if (candidates.length >0) {
                if (options.includeAnswer) candidates.push(adef)
                candidates.sort(randOrd)
                questions.push(options.callback({qkey:qkey,akey:akey,qdef:qdef,adef:adef,candidates:candidates,line:line,lineNum:lineNum,defNum:qdefNum+adefNum}))
              }
            })
          })
          
        })
      })
    })
    return questions.sort(randOrd).slice(0,options.maxQuestions)
  }
})()