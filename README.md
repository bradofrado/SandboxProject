# Sandbox

This is a [T3 Stack](https://create.t3.gg/) project bootstrapped with `create-t3-app`.

## Developing locally

Run this command in the root directory:

```
cat .env.example > .env
```

Now run this command
```
openssl rand -base64 32
```

Put the value outputted inside of `NEXTAUTH_SECRET=""` and uncomment that line

You should now be good to go. The dubugger is configured inside of .vscode, so just navigating to `Run and Debug` then clicking run
will start the debugger, which will allow you to run the application and set debug statements right in vscode.