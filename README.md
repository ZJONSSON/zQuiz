#zQuiz.js v 0.0.1 

## zQuiz.multi(definitions,options)

Creates multiple choice questions from a definition object.
### definitions
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
                        


### options

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
    
