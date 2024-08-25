import multer from 'multer';
import { Request, Response, NextFunction } from 'express';
import { readFile, rename } from 'fs/promises';
import { Express } from 'express-serve-static-core';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

// Tutte le domande che vengono lette dal file json
export let AllQuestions: string[];

export const SetAllQuestions = async (): Promise<any> => {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = dirname(__filename);
  const data = await readFile(join(__dirname, '../questions.json'), 'utf8');
  AllQuestions = JSON.parse(data);
}

export const SetupAPI = (app: Express) => {
  const upload = multer({ dest: 'uploads/' });

  const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers['authorization'];
    if (token === process.env.SECRET_TOKEN) {
      next();
    } else {
      res.status(403).json({ error: 'Accesso non autorizzato' });
    }
  };


  app.post('/upload', authMiddleware, upload.single('file'), async (req: Request, res: Response) => {
    console.log('eccoci');
    const tempPath = req.file?.path;
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = dirname(__filename);
    const targetPath = join(__dirname, '../questions.json');

    if (!tempPath) {
      return res.status(400).json({ error: 'File non trovato' });
    }

    try {
      await rename(tempPath, targetPath);
      const data = await readFile(targetPath, 'utf8');
      const AllQuestions = JSON.parse(data);
      console.log(AllQuestions);
      res.status(200).json({ message: 'File aggiornato con successo' });
    } catch (err) {
      res.status(500).json({ error: 'Errore durante il salvataggio del file' });
    }
  });
}
