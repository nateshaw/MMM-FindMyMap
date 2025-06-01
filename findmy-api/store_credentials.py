import keyring

SERVICE_NAME = "findmy"

icloud_user = input("Enter your Apple ID: ")
icloud_pass = input("Enter your Apple ID password: ")

keyring.set_password(SERVICE_NAME, "ICLOUD_USER", icloud_user)
keyring.set_password(SERVICE_NAME, "ICLOUD_PASS", icloud_pass)

print("✅ Credentials securely stored in your system's keyring.")
