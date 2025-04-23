#zQuiz.js v 0.0.1 
See working demo at: <http://zjonsson.github.io/zQuiz/>

## Background

Helping my kids preparing for exams I searched the net for software that would allow me to create multiple choice questions from their school material.  However I only found packages where you would have to manually define the wrong answers in addition to the correct one for each question, making the test-generation a very tedious process.  

zQuiz was designed to minimize the effort needed for an expanded multiple choice from any material.  All you need to do is to supply a list of connected definitions and zQuiz creates permutations of multiple-choice right and wrong answers. The definitions should be an array of objects, where each object contains all true definition for a particular "thing".  Wrong answers for a particular Object key are generated from other objects that share the same key.

There is no restriction on the structure of definitions, i.e. any "key" is considered a group and the value can either be a string (for one particular correct answer) or an array (if all answers in the array are correct). Any key that starts with an underscore is excluded, allowing for line by line options (such as ```_ignore``` and ```_group```)


## Example
The following 3 lines of definitions will, with no restrictions,  result in 100 multiple choice questions , i.e. any combination of a ```word```, ```definition```, ```synonym``` and an ```antonym```.

        {word:"abridge",def:"to make shorter",synonyms:["shorten","condense","abbreviate"],antonyms:["expand","enlarge","augment"]},
        {word:"adherent",def:"a follower, supporter",synonyms:["disciple"],antonyms:["opponent","adversary","critic","detractor"]},
        {word:"altercation",def:"an angry argument",synonyms:"quarrel",synonyms:["dispute","squabble"],antonyms:["agreement","accord"]},

We can  restrict the resulting questions  using various options, reducing the level of complexity.  For example, if we select the following option ```noQuestion:["synonyms","antonyms"]```, we will not get any questions that start with a synonym or an antonym (although the answer key can be a synonym/antonym) and our total number of questions goes down to 36.


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
    
    noQuestion:    List of categories that will not form an answer  
    noAnswers:      List of categories that will not form a question  
    onlyQuestion:  If defined, answer-keys will only be from this list
    onlyAnswer:    If defined, questions-key will only be from this list
    noGroups:       If true then the _group property will be ignored and candidates will be
                    selected from all definitions sharing same category key
    
    Advanced:
    callback:       function to process each resulting question.
                    by default this function returns the inputs as an asso
                    {qkey,akey,qdef,adef,candidates,line,lineNum}
    
## Licence
zQuiz.js v 0.0.1
Copyright (C) 2012 Ziggy Jonsson  

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program.  If not, see <http://www.gnu.org/licenses/>
