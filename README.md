# fire-restore
A backup and restore tool for firestore.

## Instalation
	npm install -g fire-restore

## Usage
### Backup
	fire-restore -a ./serviceAccount.json -b -p /users -o ./bkp.json
### Restore
	fire-restore -a ./serviceAccount.json -r -p /users -o ./bkp.json

## Flags
| Flag | Description | Required | Default |
| ---- | ----------- | -------- | ------- |
| -a   | Firebase service account file path | **Y** | - |
| -b   | Tells the script to run a backup | **Y**(on backup) | - |
| -r   | Tells the script to run a restore | **Y**(on restore) | - |
| -p   | Sets the script to work on a specific path(collection or document) | **N** | / |
| -o   | Sets the backup file path | **Y** | - |

## Known Issues
If you have really large collections or just huge amounts of data, maybe you might fall into some timeout problems...
Other than that, it's looking pretty good.
Feel free to open up an issue if you find any other problems or suggestions.