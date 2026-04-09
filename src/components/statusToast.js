const STATUS_ICONS = {
    success: "bi-check-circle-fill",
    error: "bi-x-octagon-fill",
    info: "bi-info-circle-fill",
};

const StatusToast = ({ status, onClose }) => {
    if (!status?.message) {
        return null;
    }

    const tone = status.type || "info";
    const iconClass = STATUS_ICONS[tone] || STATUS_ICONS.info;

    return (
        <div
            className={`status-toast status-toast-${tone} shadow-sm`}
            role="alert"
            aria-live="polite"
        >
            <div className="d-flex align-items-start gap-3">
                <i className={`bi ${iconClass} status-toast-icon`}></i>
                <div className="flex-grow-1">
                    {status.title && <div className="status-toast-title">{status.title}</div>}
                    <div className="status-toast-message">{status.message}</div>
                </div>
                <button
                    type="button"
                    className="btn-close"
                    aria-label="Close message"
                    onClick={onClose}
                ></button>
            </div>
        </div>
    );
};

export default StatusToast;
