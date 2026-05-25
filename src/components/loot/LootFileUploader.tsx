import { useRef, useState, type DragEvent } from 'react';

interface LootFileUploaderProps {
  variant: 'initial' | 'secondary';
  fileName?: string;
  isLoading?: boolean;
  onFileSelect: (file: File) => void;
}

export const LootFileUploader = ({
  variant,
  fileName,
  isLoading = false,
  onFileSelect,
}: LootFileUploaderProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFile = (file: File | undefined) => {
    if (!file || isLoading) return;
    onFileSelect(file);
    if (inputRef.current) inputRef.current.value = '';
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    handleFile(event.target.files?.[0]);
  };

  const handleDragOver = (event: DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
    if (!isLoading) setIsDragging(true);
  };

  const handleDragLeave = () => setIsDragging(false);

  const handleDrop = (event: DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
    setIsDragging(false);
    handleFile(event.dataTransfer.files?.[0]);
  };

  const isSecondary = variant === 'secondary';

  return (
    <section
      className={`loot-uploader ${isSecondary ? 'loot-uploader--secondary' : 'loot-uploader--initial'}`}
    >
      {isSecondary ? (
        <p className="loot-uploader__message">
          Está visualizando el resumen del archivo{' '}
          <strong className="loot-uploader__filename">{fileName}</strong>. Si desea ver otro
          reporte, adjunte su nuevo archivo aquí.
        </p>
      ) : (
        <>
          <p className="loot-uploader__subtitle">
            Arrastra un archivo CSV o JSON, o haz clic para seleccionarlo.
          </p>
        </>
      )}

      <label
        className={`loot-uploader__dropzone ${isDragging ? 'loot-uploader__dropzone--dragging' : ''} ${isLoading ? 'loot-uploader__dropzone--loading' : ''}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <input
          ref={inputRef}
          type="file"
          accept=".csv,.json"
          className="loot-uploader__input"
          onChange={handleInputChange}
          disabled={isLoading}
        />

        <span className="loot-uploader__icon" aria-hidden="true">
          {isLoading ? '…' : '↑'}
        </span>
        <span className="loot-uploader__prompt">
          {isLoading
            ? 'Procesando archivo...'
            : isSecondary
              ? 'Arrastra otro archivo aquí o haz clic para reemplazar el reporte'
              : 'Arrastra tu archivo aquí o haz clic para explorar'}
        </span>
        <span className="loot-uploader__hint">Formatos aceptados: .csv, .json</span>
      </label>
    </section>
  );
};
