
# How to create a postgresql user


## ON WINDOWS : 
1. Install WSL and run a Linux on it.

## On Linux :

1. Install pg on your distribution of choice, per exemple on Arch (using yay) :
`yay -S postgresql` 
2. Login as the postgres user using `sudo -i -u postgres`
3. create your user using createuser --interactive

Then, simply answer the prompts given to you in your terminal.

Once this is done, you may simply go on to [[Creating the postgresql database]]