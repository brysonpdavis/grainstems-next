import React, { type FormEvent, useState } from 'react'
import { api } from '../utils/api'


export const UploadForm: React.FC = () => {
    type UploadStage = "before" | "during" | "after" | "error"

    const [uploadStage, setUploadStage] = useState<UploadStage>("before")
    const [uploadName, setUploadName] = useState('')
    const [uploadDescription, setUploadDescription] = useState('')
    const [chosenFileName, setChosenFileName] = useState<string>()

    const getUploadUrl = api.aws.getUploadUrl.useMutation()
    const insertStem = api.stems.insertUpload.useMutation()

    const upload = (event: FormEvent<HTMLFormElement>) => {
        setUploadStage('during')

        event.preventDefault()

        const formData = new FormData(event.currentTarget)
        const file = formData.get('file') as File
        const extension = file.name.split('.').at(-1)!
        const fileNameWithExtension = `${uploadName.replace(' ', '-')}.${extension}`
        const fileType = file.type

        getUploadUrl.mutateAsync({ name: fileNameWithExtension, type: fileType })
            .then(async ({ presignedUrlResponse: { url, fields }, key, bucket }) => {
                const uploadData = new FormData()

                Object.entries({ ...fields, file }).forEach(([key, value]) => {
                    uploadData.append(key, value)
                })

                await fetch(url, { method: 'POST', body: uploadData })

                return { key, bucket }
            })
            .then(({ key, bucket }) => insertStem.mutateAsync({ bucket, key, name: uploadName }))
            .then(() => setUploadStage('after'))
            .catch(err => console.error(err))
    }

    if (uploadStage === 'during') {
        return <h3>U P L O A D I N G . . .</h3>
    }

    if (uploadStage === 'after') {
        return <h3>your sample was sucessfully uploaded</h3>
    }

    if (uploadStage === 'error') {
        return <h3>oops, something went wrong</h3>
    }

    return (
        <div>
            <form onSubmit={upload}>
                <div className='column'>
                    <h3>upload your own sample for others to experiment with</h3>

                    <h3>name:</h3>
                    <input
                        type='text'
                        value={uploadName}
                        onChange={(e) => setUploadName(e.target.value)}
                        maxLength={14}
                        required />
                    <h3>a short description:</h3>
                    <input
                        type='text'
                        value={uploadDescription}
                        onChange={(e) => setUploadDescription(e.target.value)}
                        maxLength={50}
                        required />
                    <h3>file:</h3>
                    <label htmlFor='file'><h3 className='upload-box'>{chosenFileName ? chosenFileName : "click here to choose a file"}</h3></label>
                    <input
                        type='file'
                        name='file'
                        id='file'
                        accept='audio/*'
                        onChange={(e) => setChosenFileName(e.target.files?.[0]?.name)}
                        style={{ display: 'none' }}
                        required
                    />
                    <input type='submit' value='submit' className='submit-upload-button' />
                </div>
            </form>

        </div>
    )
}

