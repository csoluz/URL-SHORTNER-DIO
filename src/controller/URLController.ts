//import { URLModel } from './../database/model/URL';
import { Request, Response } from 'express'
import shortId from 'shortid'
import { config } from '../config/Constants'
import { URLModel } from './../database/model/URL'

export class URLController {
    public async shorten(req: Request, res: Response): Promise<void> {
        // Verificar se a URL não existe
        const { originURL } = req.body
        const url = await URLModel.findOne({ originURL })
        if (url) {
            res.json(url)
            return
        }
        // Criar um hash para a URL
        const hash = shortId.generate()
        const shortURL = `${config.API_URL}/${hash}`  
        // Salvar a URL no banco de dados
        const newURL = await URLModel.create({ hash, shortURL, originURL })
        res.json(newURL)
        // e retornar a URL que foi salva no banco
        
    }

    public async redirect(req: Request, res: Response): Promise<void> {
        // Obter o hash da URL,
        const { hash } = req.params
        // Encontrar a URL original pelo hash obtido acima
        const url = await URLModel.findOne({ hash })
        if (url) {
            res.redirect(url.originURL)
            return
        }
        // Redirecionar para a URL original a partir do que encontramos no banco
        res.status(400).json({ error: 'URL not found'})
    }
}