import mysql.connector as mc
from .hash_password import PasswordHasher

class Database:

    def __init__(self, host="localhost", user="root", password="root", database="swd_project", autocommit=True, auth_plugin = "mysql_native_password"):

        # host = "sql12.freesqldatabase.com"
        # user = "sql12766620"
        # password = "5Pr4c9msCG"
        # database = "sql12766620"        

        self.host = host
        self.user = user
        self.password = password
        self.database = database
        self.autocommit = autocommit
        self.auth_plugin = auth_plugin
        self.hdl = mc.connect(host=self.host, user=self.user, password=self.password,
                              database=self.database, autocommit=self.autocommit, auth_plugin = self.auth_plugin)
        self.crs = self.hdl.cursor()

    def create_tables(self):

        self.crs.execute("""
        create table if not exists registration_otp(
                        email varchar(256) primary key,
                        otp int
                        );
        """)

        self.crs.execute("""
        create table if not exists reset_password_otp(
                        email varchar(256) primary key,
                        otp int
                        );
        """)

        self.crs.execute("""
        create table if not exists user_credentials(
                        username varchar(256) primary key,
                        password varchar(64),
                        email varchar(256),
                        is_student boolean,
                        session_id varchar(36)
                        );
        """)


    def save_registration_otp(self, email, otp):

        self.crs.execute(f"""
        select * from registration_otp where email = "{email}";
        """)

        result = self.crs.fetchone()

        if(result):
            self.crs.execute(f"""
            update registration_otp set otp = {otp} where email = "{email}"; 
            """)
        else:
            self.crs.execute(f"""
            insert into registration_otp values ("{email}", {otp});
            """)

    def user_exists(self, username):
        
        self.crs.execute(f"""
            select * from user_credentials where username = "{username}";
            """)
        
        result = self.crs.fetchone()

        if(result):
            return True
        else:
            return False

    def email_exists(self, email):

        self.crs.execute(f"""
            select * from user_credentials where email = "{email}";
            """)
        
        result = self.crs.fetchone()

        if(result):
            return True 
        else:
            return False

    def valid_registration_otp(self, email, otp):

        self.crs.execute(f"""
        select otp from registration_otp where email = "{email}";
        """)

        result = self.crs.fetchone()

        if(result and result[0] == otp):
            return True
        else:
            return False

    def register(self, username, password, email, is_student):

        if(is_student):
            is_student = 1
        else:
            is_student = 0

        self.crs.execute(f"""
        insert into user_credentials values ("{username}", "{password}", "{email}", "{is_student}", NULL);
        """)
    
    def authenticate(self, username, password):
        
        self.crs.execute(f"""
        select password from user_credentials where username = "{username}";
        """)

        result = self.crs.fetchone()

        if(result and PasswordHasher.check_password_bcrypt(password, result[0])):
            return True
        else:
            return False
        
    def user_email_combination_exists(self, username, email):
        
        self.crs.execute(f"""
        select * from user_credentials where username = "{username}" and email = "{email}";
        """)

        result = self.crs.fetchone()

        if(result):
            return True
        else:
            return False
        
    def save_reset_password_otp(self, email, otp):

        self.crs.execute(f"""
        select * from reset_password_otp where email = "{email}";
        """)

        result = self.crs.fetchone()

        if(result):
            self.crs.execute(f"""
            update reset_password_otp set otp = {otp} where email = "{email}";
            """)
        else:
            self.crs.execute(f"""
            insert into reset_password_otp values ("{email}", {otp});
            """)
    
    def reset_password(self, username, new_password):
        
        self.crs.execute(f"""
        update user_credentials set password = "{new_password}" where username = "{username}";
        """)    

    def valid_reset_password_otp(self, email, otp):
        
        self.crs.execute(f"""
        select otp from reset_password_otp where email = "{email}";
        """)

        result = self.crs.fetchone()

        if(result and result[0] == otp):
            return True
        else:
            return False
        
    def is_student(self, username):
        
        self.crs.execute(f"""
        select is_student from user_credentials where username = "{username}";
        """)

        result = self.crs.fetchone()

        if(result and result[0]):
            return True
        else:
            return False
        
    def clear_otp(self, email, otp_type):
        
        if (otp_type == "registration"):
            self.crs.execute(f"""
            delete from registration_otp where email = "{email}";
            """)
        
        elif (otp_type == "reset_password"):
            self.crs.execute(f"""
            delete from reset_password_otp where email = "{email}";
            """)

    def user_email_combination_exists(self, username, email):
        
        self.crs.execute(f"""
        select * from user_credentials where username = "{username}" and email = "{email}";
        """)

        result = self.crs.fetchone()

        if(result):
            return True
        else:
            return False
        
    def save_session_id(self, username, session_id):
        
        self.crs.execute(f"""
        update user_credentials set session_id = "{session_id}" where username = "{username}";
        """)

    def valid_session_id(self, username, session_id):
        
        self.crs.execute(f"""
        select session_id from user_credentials where username = "{username}";
        """)

        result = self.crs.fetchone()

        print(result)

        if(result and result[0] == session_id):
            return True
        else:
            return False
        
    def clear_session_id(self, username):
        
        self.crs.execute(f"""
        update user_credentials set session_id = NULL where username = "{username}";
        """
        )
        
    def close(self):
        self.hdl.close()

    def delete_tables(self):
        self.crs.execute("drop table registration_otp;")
        self.crs.execute("drop table reset_password_otp;")
        self.crs.execute("drop table user_credentials;")

def main():
    database = Database()
    database.delete_tables()
    database.close()

if (__name__ == "__main__"):
    main()