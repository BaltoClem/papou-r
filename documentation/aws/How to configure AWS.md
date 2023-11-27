# Requirements

At initialisation, AWS SDK looks for the environment variable `AWS_PROFILE` which needs to indicate the name of the profile configured for the app

This profile is located in a your home directory, under
`$HOME`/.aws/credentials

your home directory depends on your `%UserProfile%` in Windows and `$HOME` or ~ (tilde) in Unix-based systems.

the credentials files looks like this :

```MD
[personal-account]
aws_access_key_id =  MyAccessKeyID
aws_secret_access_key = MySecretAccessKey
```
