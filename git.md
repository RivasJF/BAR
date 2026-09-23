## ADD CHANGES TO THE LAST COMMIT

Pasos a seguirAgrega el archivo olvidado al área de preparación (staging):

```bash
git add <nombre_del_archivo>
```
Usa el código con precaución.Integra el cambio en el último commit sin cambiar el mensaje original:
```bash
git commit --amend --no-edit
```
Usa el código con precaución.(Si prefieres cambiar también el mensaje del commit, ejecuta solo `git commit --amend` o usa `git commit --amend -m "Nuevo mensaje"`).
