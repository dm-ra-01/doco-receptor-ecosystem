# VM Configuration Guide

This guide outlines the configuration process for the `common-bond` development environment on Ubuntu 25.10.

## 1. SSH Server Setup & Hardening

Ensure the SSH server is installed, running, and secured.

### Installation & Service Management
If you encounter a "Connection Refused" error, the SSH server may not be installed or running.

1.  **Install OpenSSH Server**:
    ```bash
    sudo apt update
    sudo apt install openssh-server -y
    ```
2.  **Enable and Start Service**:
    ```bash
    sudo systemctl enable --now ssh
    ```
3.  **Check Status**:
    ```bash
    sudo systemctl status ssh
    ```
4.  **Allow through Firewall** (if active):
    ```bash
    sudo ufw allow ssh
    ```

### Key-Only Authentication
1.  **Add your public key** to `~/.ssh/authorized_keys` on the VM.
2.  **Modify SSH Configuration**:
    Edit `/etc/ssh/sshd_config`:
    ```bash
    sudo nano /etc/ssh/sshd_config
    ```
3.  **Update settings**:
    Ensure the following lines are set:
    ```ssh
    PasswordAuthentication no
    PubkeyAuthentication yes
    ChallengeResponseAuthentication no
    UsePAM no
    ```
4.  **Restart SSH Service**:
    ```bash
    sudo systemctl restart ssh
    ```

## 2. Docker & Docker Compose

Install the latest version of Docker and the Docker Compose plugin.

### Installation
```bash
# Add Docker's official GPG key:
sudo apt-get update
sudo apt-get install ca-certificates curl
sudo install -m 0755 -d /etc/apt/keyrings
sudo curl -fsSL https://download.docker.com/linux/ubuntu/gpg -o /etc/apt/keyrings/docker.asc
sudo chmod a+r /etc/apt/keyrings/docker.asc

# Add the repository to Apt sources:
echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.asc] https://download.docker.com/linux/ubuntu \
  $(. /etc/os-release && echo "$VERSION_CODENAME") stable" | \
  sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
sudo apt-get update

# Install Docker packages:
sudo apt-get install docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin

# Ensure Docker Compose plugin is installed specifically:
sudo apt-get install docker-compose-plugin
```

### User Permissions
Allow running Docker without `sudo`:
```bash
sudo usermod -aG docker $USER
newgrp docker
```

## 3. Google Chrome & Antigravity

Setup the browser and the agentic AI coding assistant.

### Google Chrome
Install Google Chrome for browsing and as a dependency for certain Antigravity features.

```bash
wget https://dl.google.com/linux/direct/google-chrome-stable_current_amd64.deb
sudo apt install ./google-chrome-stable_current_amd64.deb -y
```

### Google Antigravity
Follow these steps to install and configure Antigravity for Linux.

1. **Add the repository to sources.list.d**:
   ```bash
    sudo mkdir -p /etc/apt/keyrings
    curl -fsSL https://us-central1-apt.pkg.dev/doc/repo-signing-key.gpg | \
    sudo gpg --dearmor --yes -o /etc/apt/keyrings/antigravity-repo-key.gpg
    echo "deb [signed-by=/etc/apt/keyrings/antigravity-repo-key.gpg] https://us-central1-apt.pkg.dev/projects/antigravity-auto-updater-dev/ antigravity-debian main" | \
    sudo tee /etc/apt/sources.list.d/antigravity.list > /dev/null   
    ```

2. **Update the package cache**:
    ```bash
    sudo apt update
    ```

3. **Install the package**
    ```bash
    sudo apt install antigravity
    ```

4. **Setup MCP Docker Access**:
   To allow Antigravity to manage Docker processes, ensure the MCP configuration points to the Docker socket:
   - **Socket Path**: `/var/run/docker.sock`
   - **Permissions**: Ensure the user running Antigravity is in the `docker` group (see Section 2).

## 4. Memory & Swap Configuration

The VM is configured with swap space to handle memory-intensive operations like Docker containers and development tools.

### Current Configuration
| Resource | Size |
|----------|------|
| RAM      | 14 GB |
| Swap     | 16 GB |

### Resizing Swap
To resize the swap file (e.g., to 16GB):

```bash
# Disable current swap
sudo swapoff /swap.img

# Remove old swap file and create new one
sudo rm /swap.img
sudo fallocate -l 16G /swap.img

# Set permissions and format
sudo chmod 600 /swap.img
sudo mkswap /swap.img

# Enable swap
sudo swapon /swap.img
```

### Verify Configuration
```bash
swapon --show
free -h
```

### Make Permanent
Ensure `/etc/fstab` contains the swap entry:
```bash
/swap.img none swap sw 0 0
```

## 5. Development Tools

### VS Code Workspace Optimization
To prevent file watcher exhaustion (the `ENOSPC` error), it is recommended to exclude large directories that don't need real-time monitoring.

1.  **Create/Open** `.vscode/settings.json` in the root of your developer workspace (e.g., `~/development/.vscode/settings.json`).
2.  **Add the following configuration**:
    ```json
    {
      "files.watcherExclude": {
        "**/node_modules/**": true,
        "**/supabase-launchpad/supabase/**": true,
        "**/dist/**": true,
        "**/build/**": true,
        "**/receptor-dev/volumes/db/data/**": true,
        "**/.git/objects/**": true,
        "**/node_modules/*/**": true
      }
    }
    ```

### Node.js
Install Node.js using `nvm` (Node Version Manager) for flexible version management.

```bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.1/install.sh | bash
# Restart terminal or source bashrc
source ~/.bashrc
nvm install --lts
```

### Supabase CLI
Install the Supabase CLI for managing backend services.

```bash
# Install via NPM
npm install supabase --save-dev
```

## 5. Remote Login


### Installation

Go to system -> remote login
Set a different username and password

### Secure Tunnel Configuration

Create an RDP file. Add the following:
`use redirection server name:i:1`

## 6. GitLab SSH Key Setup

Create a secure SSH key for repository access.

### 1. Generate the Key
On the `common-bond` VM, run:
```bash
ssh-keygen -t ed25519 -C "ryan@common-bond-vm"
```
When prompted, save the key to the default location (`~/.ssh/id_ed25519`).

### 2. Add to SSH Agent
```bash
eval "$(ssh-agent -s)"
ssh-add ~/.ssh/id_ed25519
```

### 3. Add to GitLab
1.  **Copy the public key**:
    ```bash
    cat ~/.ssh/id_ed25519.pub
    ```
2.  **Navigation**: Go to GitLab > User Settings > SSH Keys.
3.  **Add Key**: Paste the copied text and give it a descriptive title (e.g., `ryan@common-bond-vm`).

:::tip Security
Using Ed25519 is recommended for its better security and performance compared to RSA.
:::

:::note RDP over Cloudflared
To connect via RDP over the Common Bond VMNet, ensure you have a `cloudflared` tunnel configured to forward local traffic to port 3389 on the VM.
:::

:::warning Security
Disabling `UsePAM` in SSH configuration might disable other security features like account lockout or non-password authentication modules. Ensure you have tested key-based access before logging out.
:::
