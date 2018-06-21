---
title: Manage Your Dotfiles
date: 2018-05-18
---

# Dotfiles
Your dotfiles are everchanging and it's not always easy to keep them in check. Whether you're a distrohopper that doesn't keep a separate home partition or you just like a clean re-install every once in a while, setting your system back up can be a chore.


# Options
There are three options for managing your dotfiles. From the least amount of dependencies to the most amount of dependencies, your options are:
1. Manually
2. Scripts
3. External Tools

Manually linking your dotfiles to their required locations sounds like a really tedious thing to do and I hope nobody is subjected to this kind of torture.

External tools like [GNU Stow](https://www.gnu.org/software/stow/) can be used to manage your dotfiles, however I feel these add an unnecessary layer of complexity.

Scripts, as in shell scripts, are the method I choose for managing my dotfiles. Not only does the task become super simple, there should be no external dependencies and therefore everything will just run out of the box.


# My Script
I have a very specific list of tasks that I want my script to perform to set up my dotfiles.

**Let the source file have a different name as compared to the target file.**  
I prefer to not have the actual dots in front of the files so they don't appear hidden where they're supposed to be visible.  
For example: `vimrc` in my dotfiles directory and `.vimrc` in my home directory.

**When the target file already exists, I want to be prompted to remove it.**  
This is useful for when you accidentally open the program that automatically creates its own config file before you linked your config file to the correct destination.

**When the target file exists but the source file does not, I want to be prompted to move the target to the source and then link the source to the target.**  
For example: `~/.bash_profile` is usually created automatically if you run a desktop environment, let's say you edit it a bit but then you realize you want that file to be in your dotfiles so it can be restored later on. Well, you would have to move the file to your dotfiles and symlink it yourself.  

Annoying. I would rather put `l bash_profile ~/.bash_profile` into the script and run it. The script should move `~/.bash_profile` to my dotfiles directory as `bash_profile` and then symlink it back to `~/.bash_profile`.

```bash
#!/bin/bash
#
# Mike Mob's dotfiles installer
#
# Delete dead symlinks
# find -L $(pwd) -maxdepth 3 -type l -delete
#
cd $(readlink -f "${0%/*}/")  # Set cd to script's directory

c() { read -n 1 -p "$@ (y/N) " a && [ ${a,,} = "y" ] && return 0; }
l() {
  # Test if target is a symlink
  test -L $2 && return 0

  # Test if target exists and is not a symlink
  if [[ -a $2 ]]; then
    if [[ ! -a $1 ]]; then
      # Target exists and source does not exist
      c "* Move '$2' to '$(pwd)/$1'?" && mv "$2" "./$1"
    else
      # Target exists and source exists
      c "* File '$2' exists... delete it?" && rm "$2"
    fi
  fi

  # Create parent directories
  mkdir -p $(dirname $2)

  # Create symbolic link
  ln -sf "$(pwd)/$1" "$2" && "Linked '$1' -> '$2'"
}


# Link your files below:
# l {source} {target}
l bashrc ~/.bashrc
l vimrc  ~/.vimrc
```


# Conclusion
Writing a script to manage my dotfiles was the simplest and therefore best method for me. It may not be the best method for you and so I urge you to try all methods of managing your dotfiles and see which is easiest for you.

If you're at all interested, you can look at my dotfiles [here](https://github.com/thetarkus/dotfiles).
