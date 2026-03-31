"use client";

import { useState } from "react";

export default function PublicListingGallery({
  photos,
  address,
}: {
  photos: string[];
  address: string;
}) {
  const [activePhotoIndex, setActivePhotoIndex] = useState(0);
  const activePhoto = photos[activePhotoIndex] ?? null;

  return (
    <div>
      {activePhoto ? (
        <div
          style={{
            height: "420px",
            borderRadius: "24px",
            overflow: "hidden",
            marginBottom: "18px",
            boxShadow: "var(--ackret-shadow)",
            background: "#f3efe6",
          }}
        >
          <img
            src={activePhoto}
            alt={address || "Listing photo"}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              display: "block",
            }}
          />
        </div>
      ) : (
        <div
          style={{
            height: "420px",
            borderRadius: "24px",
            overflow: "hidden",
            marginBottom: "18px",
            background: "linear-gradient(180deg, #f4f2ec 0%, #e6e1d7 100%)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "var(--ackret-muted)",
            fontSize: "16px",
          }}
        >
          Listing Photo
        </div>
      )}

      {photos.length > 1 ? (
        <div
          style={{
            display: "flex",
            gap: "12px",
            marginBottom: "30px",
            overflowX: "auto",
            paddingBottom: "4px",
          }}
        >
          {photos.map((url, index) => (
            <button
              key={index}
              type="button"
              onClick={() => setActivePhotoIndex(index)}
              style={{
                display: "block",
                flex: "0 0 auto",
                width: "132px",
                height: "88px",
                borderRadius: "14px",
                overflow: "hidden",
                border:
                  index === activePhotoIndex
                    ? "3px solid var(--ackret-gold-dark)"
                    : "1px solid rgba(22,58,112,0.12)",
                background: "#ffffff",
                padding: 0,
                cursor: "pointer",
              }}
            >
              <img
                src={url}
                alt={`Listing photo ${index + 1}`}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  display: "block",
                }}
              />
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}