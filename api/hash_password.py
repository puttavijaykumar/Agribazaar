import bcrypt

class PasswordHasher:

    def hash_password_bcrypt(password: str) -> str:

        salt = bcrypt.gensalt()
        hashed_password = bcrypt.hashpw(password.encode('utf-8'), salt)
        return hashed_password.decode('utf-8')

    def check_password_bcrypt(password: str, hashed_password: str) -> bool:

        return bcrypt.checkpw(password.encode('utf-8'), hashed_password.encode('utf-8'))


def main():
    
    password = "my_secure_password"
    hashed_password = PasswordHasher.hash_password_bcrypt(password)
    print(f"Hashed Password: {hashed_password}")

    is_correct = PasswordHasher.check_password_bcrypt(password, hashed_password)
    print(f"Password is correct: {is_correct}")

if(__name__ == "__main__"):
    print()
    main()
    print()
