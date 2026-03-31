import puter from "@heyputer/puter.js";
import { getOrCreateHostingConfig, uploadImageToHosting } from "./puter.hosting";
import { isHostedUrl } from "./utils";
export const signIn = async () => await puter.auth.signIn();

export const signOut = () => puter.auth.signOut();

export const getCurretUser = async () => {
    try {
        const user = await puter.auth.getUser();
        return user;
    }
    catch {
        return null;
    }
}

export const CreateProject = async ({ item, visibility} : CreateProjectParams):
Promise<DesignItem | null | undefined> => {
    const projectId = item.id;

    const hosting = await getOrCreateHostingConfig();

    const hostedSource = projectId ? await uploadImageToHosting({
        hosting, url : item.sourceImage, projectId, label: 'source',
    }) : null;

    const hostedRender = projectId && item.renderedImage ? 
    await uploadImageToHosting({ hosting, url: item.renderedImage, projectId, label: 'rendered',}) : null;

    const resolvedSource = hostedSource?.url || (isHostedUrl(item.sourceImage) ? item.sourceImage 
    : ''
    );

    if(!resolvedSource) {
        console.warn("failed to host source image, skipping save.");
        return null;
    }

    const resolvedRender = hostedRender?.url
    ? hostedRender?.url
    : item.renderedImage && isHostedUrl(item.renderedImage)
    ? item.renderedImage : undefined;

    const {
        sourcePath: _sourcePath,
        renderedPath: _renderedPath,
        publicPath: _publicPath,
        ...rest
    } = item;

    const payload = {
        ...rest,
        visibility: visibility || "private",
        sourceImage: resolvedSource,
        renderedImage: resolvedRender,
    } as DesignItem;

    try {
        await puter.kv.set(`project_${projectId}`, payload);
        return payload; 
    }
    catch(e){
        console.log('Failed to save the project:', e);
        return null;
    }
}