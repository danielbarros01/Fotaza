import { Publication, Rating } from '../models/Index.js'

async function saveQualification(rating) {
    const ratings = await Rating.findAll({ where: { publicationId: rating.publicationId } })

    let total = 0
    const count = ratings.length

    ratings.forEach(r => {
        total += r.value
    });

    const average = count > 0 ? total / count : 0;

    const publication = await Publication.findByPk(rating.publicationId)
    publication.qualification = average

    await publication.save()
}

export default saveQualification