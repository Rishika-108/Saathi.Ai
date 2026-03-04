const DisclaimerNotice = ({
  hasAcceptedDisclaimer,
  setHasAcceptedDisclaimer,
}) => {
  return (
    <div className="p-4 bg-primary-soft border border-borderColor rounded-md mb-3">
      <label className="flex items-start gap-2 text-sm text-textSecondary">
        <input
          type="checkbox"
          checked={hasAcceptedDisclaimer}
          onChange={(e) => setHasAcceptedDisclaimer(e.target.checked)}
        />
        This is a structured peer support session and not professional therapy.
        Please share respectfully.
      </label>
    </div>
  );
};

export default DisclaimerNotice;