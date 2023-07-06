import { DataTypes } from 'sequelize'
import Publication from './Publication.js'
import Tag from './Tag.js'
import db from '../config/db.js'

const PublicationHasTag = db.define('publications_has_tags', {
    publicationId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        field: 'publication_id',
        references: {
            model: Publication,
            key: 'id',
        },
    },
    tagId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        field: 'tag_id',
        references: {
            model: Tag,
            key: 'id',
        },
    },
}, { timestamps: false });

export default PublicationHasTag