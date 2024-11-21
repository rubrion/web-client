import React, { useEffect } from 'react';

const PageHelmet = ({
    title,
    description,
    children,
}: {
    title: string;
    description?: string;
    children: React.ReactNode;
}) => {
    useEffect(() => {
        if (!title) {
            console.warn("PageHelmet: 'title' is missing or undefined.");
            return;
        }

        document.title = title;

        if (description) {
            let metaDescription = document.querySelector('meta[name="description"]') as HTMLMetaElement | null;
            if (!metaDescription) {
                metaDescription = document.createElement('meta') as HTMLMetaElement;
                metaDescription.name = 'description';
                document.head.appendChild(metaDescription);
            }
            metaDescription.setAttribute('content', description);
        }
    }, [title, description]);

    return <>{children}</>;
};

export default PageHelmet;
