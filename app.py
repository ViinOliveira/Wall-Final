import os

# Caminho da pasta do projeto
pasta = r"C:\Users\vicav\OneDrive\Área de Trabalho\Final"
# URL do repositório remoto
url = 'https://github.com/ViinOliveira/Wall-Final.git'

os.chdir(pasta)

print("\n>>> Iniciando git init")
os.system("git init")

print("\n>>> Adicionando arquivos")
os.system("git add .")

print('\n>>> Realizando commit inicial')
os.system('git commit -m "Initial commit"')

print('\n>>> Adicionando repositório remoto')
os.system(f"git remote remove origin") # Remove origin caso já exista
os.system(f"git remote add origin {url}")

print('\n>>> Alterando branch para main')
os.system("git branch -M main")

print('\n>>> Enviando arquivos para o GitHub...')
os.system("git push -u origin main")

print("\nPRONTO! Projeto enviado para o GitHub.")
