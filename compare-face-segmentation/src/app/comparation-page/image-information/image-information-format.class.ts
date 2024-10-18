export class ImageInformationFormat {
    header: string;
    infoArray: { key: string, value: string }[];
    labelsWithColors: { label: string, color: string, score: number | null }[];
    highlightedLabel: string | null;

    constructor(header: string, infoArray: any[] = [], labelsWithColors: any[] = [], highlightedLabel: string | null = null) {
        this.header = header;
        this.infoArray = infoArray;
        this.labelsWithColors = labelsWithColors;
        this.highlightedLabel = highlightedLabel;
    }
}