from flask import Flask, request
import json
import spacy

 
app = Flask(__name__)
 
@app.route('/')
def index():
	return "Flask server"
 
@app.route('/postdata', methods = ['POST'])
def postdata():
    
    nlp = spacy.load("en_core_web_sm")

    data = request.get_json()
    x = "SK you as" or "SK us" or "sku as" or "s k u s" in data['text']
    data['text'] = data['text'].replace(x,"SKU as")
    print("data received as:",data['text'])
    txt = data['text']
    doc = nlp(txt)
    newdata = {}
    #Save-Operation
    newdata['operation'] = doc[0].text


    create_l = ['create','make','generate','produce']
    update_l = ['update','correct','rectify']
    delete_l = ['delete','remove','cancel']
    search_l = ['list','search','show','display']
    col = ['sku','company','quantity']

    token_list = []
    token_fil = []

    #Tokenizing
    for token in doc:
        token_list.append(token.text)        
    
    try:
        #Create or Delete Operation
        #Delete last few entries
        if (("previous" in token_list or "last" in token_list) and (token_list[0].lower() in delete_l or token_list[0].lower() in search_l)):
            if "previous" in token_list:
                newdata["count"] = '1'
            else:
                newdata["count"] = token_list[token_list.index("last")+1]
                
        #Create or Delete or Search based on property

        elif(token_list[0].lower() in create_l or token_list[0].lower() in delete_l or token_list[0].lower() in search_l):
            
            #Filtering tokens
            for word in token_list:
                lex = nlp.vocab[word]
                if lex.is_stop == False and lex.is_punct == False:
                    token_fil.append(word.lower())


            #Save-Date or Delete-Date
            for token in doc.ents:
                if token.label_ == 'DATE':
                    newdata[token.label_] = token.text

            
            #If Date error occurs
            if len(newdata) == 1:
                if "date" in token_fil:
                    x = token_list.index("date")
                    newdata["DATE"] = token_list[x+2] + " " + token_list[x+3].capitalize()


            #Save/Delete Other Data
            for i in range(len(doc)):
                if doc[i].text.lower() in col:

                    #If Name comes before type (eg: instead of "SKU as ABC" it has "ABC as the SKU")
                    
                    if doc[i-1].text == "as":
                        temp = token_fil.pop(token_fil.index(doc[i-2].text.lower()))
                        token_fil.insert(token_fil.index(doc[i].text.lower())+1,temp)

                    elif doc[i-2:i].text == "as the":
                        temp = token_fil.pop(token_fil.index(doc[i-3].text.lower()))
                        token_fil.insert(token_fil.index(doc[i].text.lower())+1,temp)

            print(token_fil)
            for column in col:
                if column in token_fil:
                    newdata[column] = token_fil[token_fil.index(column)+1]
                    if column == 'sku' or column == 'company':
                        newdata[column].upper()


                    
                                    
    #UPDATE OPERATION
        
        elif(token_list[0].lower() in update_l):
            newdata["set"] = {}
            for i in range(len(token_list)):
                if token_list[i].lower() == "where":
                    condition = [x.lower() for x in token_list[i+1:]]
                    set_data = [x.lower() for x in token_list[:i]]
                    break
            
            #Date
            for token in doc.ents:
                if token.label_ == 'DATE':
                    if token.text in " ".join(condition):
                        newdata[token.label_] = token.text

                    elif token.text in " ".join(set_data):
                        newdata["set"][token.label_] = token.text
            
            
            #Filtering tokens
            for word in condition:
                lex = nlp.vocab[word]
                if lex.is_stop == True or lex.is_punct == True:
                    condition.remove(word)        

            for word in set_data:
                lex = nlp.vocab[word]
                if lex.is_stop == True or lex.is_punct == True:
                    set_data.remove(word)        
            
            #Store data for updating   
            for cond in condition:
                if cond in col:
                    newdata[cond] = condition[condition.index(cond)+1]
                    if cond == 'sku' or cond == 'company':
                        newdata[cond].upper()        

            for cond in set_data:
                if cond in col:
                    newdata["set"][cond] = set_data[set_data.index(cond)+1]
                    if cond == 'sku' or cond == 'company':
                        newdata["set"][cond].upper()         


                
            


        # do something with this data variable that contains the data from the node server
        print(newdata)
        return json.dumps(newdata)
    except:
        print(newdata)
        return json.dumps(newdata)        

 
if __name__ == "__main__":
	app.run(port=5000)