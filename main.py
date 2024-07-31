from flask import Flask, render_template, request, jsonify
# from flaskext.mysql import MySQL
from flask_mysqldb import MySQL
import sys
import json
import random

app = Flask(__name__)
 
mysql = MySQL()
app.config['MYSQL_USER'] = 'root'
app.config['MYSQL_PASSWORD'] = 'Jacky_Duxy20081111'
app.config['MYSQL_DB'] = 'Blog_db'
# app.config['MYSQL_DATABASE_HOST'] = 'localhost'
# db = mysqldb.connect(host="localhost", user="root", passwd="Jacky_Duxy20081111", db="Blod_db")
mysql.init_app(app)

# if __name__ == '__main__':
#     app.run(debug=True)

@app.route('/')
def view_form():
    return render_template('login.html')


@app.route('/login', methods= ['POST']) 
def login():

    num = 0

    input_user = request.form["username"]
    input_pswd = request.form["password"]

    conn = mysql.connect
    cursor = conn.cursor()

    # select all the task from the successfuly logged in user
    cursor.execute(f'select * from user where username = "{input_user}" and pswd = "{input_pswd}"')

    #we grab all the results
    data = cursor.fetchall()

    cursor.close()
    


    # instead of just printing we want to only login if the user input correct combination
    if len(data) != 0:

        print(f"data:{data}", file = sys.stderr)
        num = data[0][3]

        print('Success', file = sys.stderr)
        # check for all the existing task for user and then load it as html inside blog.html befor running
        # grab all task from said user
        mysql_code = f'select * from task where username = "{input_user}"'
        cursor2 = conn.cursor()
        cursor2.execute(mysql_code)

        results = cursor2.fetchall()
        cursor2.close()

        mysql_code = f'select id from task order by id Desc limit 1;'
        cursor3 = conn.cursor()
        cursor3.execute(mysql_code)

        unique_id = cursor3.fetchall()
        cursor3.close()
        


        print("uniqueid: ",unique_id[0][0], file = sys.stderr)
        print(results, file = sys.stderr)
        task = [{"user_name": input_user , "unique_id": unique_id[0][0], "num":num}]
        for container in results:
            # HW NOTE : thiS IS THE PREV_CONTAITER FORMAT: LIST OF DICTIONARY 
            task.append({"id": str(container[0]), "username" :str(container[1]), "img" :str(container[2]), "task":str(container[3]) })
    
        json_data = json.dumps(task)

        #print("task has1: ", task, file = sys.stderr)

        # global taskhas1
        # taskhas1 = task
        
        

        conn.close()

        # render customer template
        return render_template('blog.html', json_data = json_data)
    else:
        conn.close()
        print('Try again', file = sys.stderr)
        # render login template with error msg
        return render_template('login.html', content = "Try again, that is wrong")


@app.route('/submit_data', methods = ['POST'])

def submit_data():


    data = request.json

    # print(container, file = sys.stderr)

    if data:
        print(type(data), file = sys.stderr)
        print(data, file = sys.stderr)
        global messenger
        messenger = data


        # datas
        task = data["task"]
        img = data["img"]
        username = data["username"]
        # id = str(random.randint(0,1000)) + str(random.randint(10000,100000))



        # # connect to mysql
        conn = mysql.connect
        cursor = conn.cursor()
        SqlCode = f'insert into task (img_list, task_list, username) value("{img}", "{task}", "{username}")'
        print(SqlCode, file = sys.stderr)
        cursor.execute(SqlCode)
        
        
        # # commit
        conn.commit()

        input_user = request.form.get("username", "")

        print('Success', file = sys.stderr)
        # check for all the existing task for user and then load it as html inside blog.html befor running
        # grab all task from said user
        mysql_code = f'select * from task where username = "{input_user}"'

        cursor.execute(mysql_code)

        results = cursor.fetchall()


        print(results, file = sys.stderr)
        task = [{"user_name": input_user}]


        # print("inside submit function: ",taskhas1, file = sys.stderr)

        # print("Container contains (previously):",container,file=sys.stderr)

        # print(messenger)

        # taskhas1.append(messenger)


        #try adding the newest task before refresh
        SqlCode = f'insert into task (img_list, task_list, username) value("{messenger["img"]}", "{messenger["task"]}", "{messenger["username"]}")'
        print(SqlCode, file = sys.stderr)
        cursor.execute(SqlCode)

        for container in results:

            # HW NOTE : thiS IS THE PREV_CONTAITER FORMAT: LIST OF DICTIONARY 
            task.append({"id": str(container[0]), "username" :str(container[1]), "img" :str(container[2]), "task":str(container[3]) })
            # taskhas1.append(messenger)

            cursor.execute(SqlCode)
            
            json_data = json.dumps(task)

            # task = taskhas1

        print("task has2: ", task, file = sys.stderr)
        

        cursor.close()
        conn.close()
        
        # # close 

        # Refresh page
        return jsonify({'message': 'Data received and processed successfully'})
    else:
        return jsonify({'error': 'No data received'})

    # # grab task and img
    # task = request.form['task']
    # img = request.form['img']

    # # update database
    # conn = mysql.connect()
    # cursor = conn.cursor()
    # cursor.execute(f'select * from user where username = "{pass}"')

@app.route('/edit_pass', methods = ['POST'])
def edit_pass():
    send_edit = request.json
    print("edit params:",send_edit)
    try:
        conn = mysql.connect
        #print("grabbed:")
        cursor = conn.cursor()

        code1 = f'UPDATE task SET task_list = "{send_edit["edit_text"]}" WHERE username = "{send_edit["username"]}" and id = "{send_edit["id"]}";'
        code2 = f'UPDATE task SET url_list = "{send_edit["edit_url"]}" WHERE username = "{send_edit["username"]}" and id = "{send_edit["id"]}";'
        # print(f'mysql code for delete in finish: {code}\n' , file = sys.stderr)
        # print(f'params {num["username"]} , {num["id"]}\n' , file = sys.stderr)
        cursor.execute(code1)
        # cursor.execute(code2)
        conn.commit()

        cursor.close()
        conn.close()

        return jsonify(message="Task updated successfully"), 200
    
    except Exception as e:
        return jsonify(error=str(e)), 500


@app.route('/get_data', methods=['GET', 'POST'])
def get_data():
    thedata = messenger
    return jsonify(thedata)

@app.route('/signup')
def signup():
    return render_template('signup.html')
    
@app.route('/num_pass', methods = ['POST'])
def num_pass():
    num = request.json
    print("Grabbed num:",num)

    try:
        conn = mysql.connect
        cursor = conn.cursor()
        # Execute the MySQL DELETE query
        code = f"UPDATE user SET num = \"{num['num']}\" WHERE username = \"{num['username']}\""
        cursor.execute(code)
        conn.commit()
        # Delete in back end
        code = f'Delete from task where username = "{num["username"]}" and id = "{num["id"]}"'

        print(f'mysql code for delete in finish: {code}\n' , file = sys.stderr)
        print(f'params {num["username"]} , {num["id"]}\n' , file = sys.stderr)
        cursor.execute(code)
        conn.commit()

        cursor.close()
        conn.close()

        return jsonify(message="Task deleted successfully"), 200
    
    except Exception as e:
        return jsonify(error=str(e)), 500



@app.route('/sign_up', methods = ['POST'])
def sign_up():
    if (request.method == 'POST'):
        # grab fullname username password from input
        signup_user = request.form['username']
        signup_fullname = request.form['fullname']
        signup_pswd = request.form['password']

        # connect to mysql
        conn = mysql.connect
        cursor = conn.cursor()
        cursor.execute(f'select * from user where username = "{signup_user}"')
        info = cursor.fetchall()

        # check if username already exists
        if (len(info) != 0):
            cursor.close()
             # if username already render signup.html with an error msg about username already taken
            print(f'usernmae already exists \n' , file = sys.stderr)
            return render_template('signup.html', content = "Username already exist, try again")
        
        else:
            
            cursor.close()
            # if not insert into mysql and render login.html
            mysql_code = f'insert into user (fullname, username, pswd) values("{signup_fullname}", "{signup_user}", "{signup_pswd}")'
            # insert username and password as a new user in the user table in mysql

            
            cursor2 = conn.cursor()
            cursor2.execute(mysql_code)
            
            conn.commit()
            cursor2.close()
            conn.close()

            return render_template('login.html', content = "account created successful, try logging it in")

@app.route('/pass_data_dltbtn', methods=['POST'])
def delete_task():

    database_i = request.json
    # print out datbase_i to check if the data transfered to main.py
    print("task had id of",database_i["id"],"is deleted", file = sys.stderr)
    id = database_i["id"]
    # print out data to check if the data transfered to main.py
    print(database_i["username"], file = sys.stderr)
    username = database_i["username"]

    try:
        conn = mysql.connect
        cursor = conn.cursor()
        # Execute the MySQL DELETE query
        code = f'Delete from task where username = "{username}" and id = "{id}"'
        cursor.execute(code)
        conn.commit()

        cursor.close()
        conn.close()

        return jsonify(message="Task deleted successfully"), 200

    except Exception as e:
        return jsonify(error=str(e)), 500




if __name__ == '__main__':
    app.run(debug=True, host = "0.0.0.0", port = 8080)