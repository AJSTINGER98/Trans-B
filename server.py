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
    t1 = ["sk you as", "skyou as" ,"sk us" , "k you" , "s k u s" , "stock keeping unit" , "uske you as" , "sq as", 'at ke us', "skew as", "skus"]
    t2 = ['is equal to','equals to', 'equals']
    data = request.get_json()
    print(data["text"])
    #Rectify some frequent recoognition errors
    for i in t1:
        if i in data['text'].lower():
            data['text'] = data['text'].lower().replace(i,"SKU as")
            break
    for j in t2:
        if j in data['text'].lower():
            data['text'] = data['text'].lower().replace(j,"is")
            break
                    
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
    
    print("Tokenized Data:", token_list)
    # if token_list[len(token_list)-1].isdigit == True:
    #     token_list.append('as')
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
                if "date" in token_list:
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
            
            #If date error occurs
            if len(newdata) == 2 and len(newdata['set']) == 0:
                if "date" in token_list:
                    x = token_list.index("date")
                    y = token_list.index("where")
                    if token_list[x+1].isdigit():
                        x = x-1
                    if x < y:
                        newdata["set"]['DATE'] = token_list[x+2] + " " + token_list[x+3].capitalize()
                    else:
                        newdata["DATE"] = token_list[x+2] + " " + token_list[x+3].capitalize()

            print(condition)
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
        print("Passed Data:",newdata)
        return json.dumps(newdata)

    except:
        newdata = {}
        return json.dumps(newdata)
 
if __name__ == "__main__":
	app.run(port=5000)